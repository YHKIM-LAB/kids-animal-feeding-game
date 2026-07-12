"use strict";

// PNG 파일을 아래 경로에 추가하면 이모지 대신 자동으로 표시됩니다.
const FOODS = {
  carrot: { name: "당근", emoji: "🥕", image: "assets/foods/carrot.png" },
  bamboo: { name: "대나무", emoji: "🎋", image: "assets/foods/bamboo.png" },
  banana: { name: "바나나", emoji: "🍌", image: "assets/foods/banana.png" },
  fish: { name: "물고기", emoji: "🐟", image: "assets/foods/fish.png" },
  bone: { name: "뼈다귀", emoji: "🦴", image: "assets/foods/bone.png" },
  watermelon: { name: "수박", emoji: "🍉", image: "assets/foods/watermelon.png" },
  leaves: { name: "나뭇잎", emoji: "🍃", image: "assets/foods/leaves.png" },
  acorn: { name: "도토리", emoji: "🌰", image: "assets/foods/acorn.png" },
  insect: { name: "벌레", emoji: "🐛", image: "assets/foods/insect.png" },
  grass: { name: "풀", emoji: "🌿", image: "assets/foods/grass.png" },
  hay: { name: "건초", emoji: "🌾", image: "assets/foods/hay.png" },
  corn: { name: "옥수수", emoji: "🌽", image: "assets/foods/corn.png" },
  sweetPotato: { name: "고구마", emoji: "🍠", image: "assets/foods/sweet-potato.png" }
};

const ANIMALS = [
  { id: "rabbit", name: "토끼", emoji: "🐰", image: "assets/animals/rabbit.png", correctFood: "carrot" },
  { id: "panda", name: "판다", emoji: "🐼", image: "assets/animals/panda.png", correctFood: "bamboo" },
  { id: "monkey", name: "원숭이", emoji: "🐵", image: "assets/animals/monkey.png", correctFood: "banana" },
  { id: "cat", name: "고양이", emoji: "🐱", image: "assets/animals/cat.png", correctFood: "fish" },
  { id: "dog", name: "강아지", emoji: "🐶", image: "assets/animals/dog.png", correctFood: "bone" },
  { id: "elephant", name: "코끼리", emoji: "🐘", image: "assets/animals/elephant.png", correctFood: "watermelon" },
  { id: "giraffe", name: "기린", emoji: "🦒", image: "assets/animals/giraffe.png", correctFood: "leaves" },
  { id: "squirrel", name: "다람쥐", emoji: "🐿️", image: "assets/animals/squirrel.png", correctFood: "acorn" },
  { id: "penguin", name: "펭귄", emoji: "🐧", image: "assets/animals/penguin.png", correctFood: "fish" },
  { id: "frog", name: "개구리", emoji: "🐸", image: "assets/animals/frog.png", correctFood: "insect" },
  { id: "cow", name: "소", emoji: "🐮", image: "assets/animals/cow.png", correctFood: "grass" },
  { id: "horse", name: "말", emoji: "🐴", image: "assets/animals/horse.png", correctFood: "hay" },
  { id: "sheep", name: "양", emoji: "🐑", image: "assets/animals/sheep.png", correctFood: "grass" },
  { id: "chicken", name: "닭", emoji: "🐔", image: "assets/animals/chicken.png", correctFood: "corn" },
  { id: "pig", name: "돼지", emoji: "🐷", image: "assets/animals/pig.png", correctFood: "sweetPotato" }
];

const startScreen = document.querySelector("#start-screen");
const gameScreen = document.querySelector("#game-screen");
const startButton = document.querySelector("#start-button");
const endButton = document.querySelector("#end-button");
const animalImage = document.querySelector("#animal-image");
const animalEmoji = document.querySelector("#animal-emoji");
const animalPrompt = document.querySelector("#animal-prompt");
const foodOptions = document.querySelector("#food-options");
const feedback = document.querySelector("#feedback");
const starCount = document.querySelector("#star-count");
const celebration = document.querySelector("#celebration");

let gameState = "start";
let stars = 0;
let currentAnimal = null;
let animalQueue = [];
let lastAnimalId = null;
let previousFoodSet = "";
let nextRoundTimer = null;
let wrongFeedbackTimer = null;
let celebrationTimer = null;
let gameSession = 0;

function showImageOrEmoji(img, emojiElement, src, emoji, alt) {
  img.hidden = true;
  emojiElement.hidden = false;
  emojiElement.textContent = emoji;
  img.alt = alt;
  img.onload = () => {
    img.hidden = false;
    emojiElement.hidden = true;
  };
  img.onerror = () => {
    img.hidden = true;
    emojiElement.hidden = false;
  };
  img.src = src;
}

function shuffled(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function refillAnimalQueue() {
  animalQueue = shuffled(ANIMALS);
  if (animalQueue.length > 1 && animalQueue[0].id === lastAnimalId) {
    [animalQueue[0], animalQueue[1]] = [animalQueue[1], animalQueue[0]];
  }
}

function chooseAnimal() {
  if (animalQueue.length === 0) refillAnimalQueue();
  const animal = animalQueue.shift();
  lastAnimalId = animal.id;
  return animal;
}

function chooseFoodOptions(correctFood) {
  const otherFoods = Object.keys(FOODS).filter((id) => id !== correctFood);
  let optionIds;
  let attempts = 0;
  do {
    optionIds = shuffled([correctFood, ...shuffled(otherFoods).slice(0, 2)]);
    attempts += 1;
  } while (optionIds.slice().sort().join("|") === previousFoodSet && attempts < 10);
  previousFoodSet = optionIds.slice().sort().join("|");
  return optionIds;
}

function makeFoodButton(foodId) {
  const food = FOODS[foodId];
  const button = document.createElement("button");
  button.type = "button";
  button.className = "food-button";
  button.dataset.foodId = foodId;
  button.setAttribute("aria-label", food.name);

  const visual = document.createElement("span");
  visual.className = "food-visual";
  visual.setAttribute("aria-hidden", "true");
  const img = document.createElement("img");
  img.alt = "";
  img.hidden = true;
  const emoji = document.createElement("span");
  emoji.className = "food-emoji";
  visual.append(img, emoji);

  const label = document.createElement("span");
  label.className = "food-name";
  label.textContent = food.name;
  button.append(visual, label);
  showImageOrEmoji(img, emoji, food.image, food.emoji, food.name);
  button.addEventListener("click", handleAnswer);
  return button;
}

function clearAllTimers() {
  window.clearTimeout(nextRoundTimer);
  window.clearTimeout(wrongFeedbackTimer);
  window.clearTimeout(celebrationTimer);
  nextRoundTimer = null;
  wrongFeedbackTimer = null;
  celebrationTimer = null;
}

function resetGameData() {
  clearAllTimers();
  gameSession += 1;
  stars = 0;
  currentAnimal = null;
  animalQueue = [];
  lastAnimalId = null;
  previousFoodSet = "";
  starCount.textContent = "0";
  foodOptions.replaceChildren();
  celebration.replaceChildren();
  feedback.className = "feedback";
  feedback.textContent = "어떤 먹이를 좋아할까요?";
}

function startRound() {
  if (gameState !== "playing") return;
  currentAnimal = chooseAnimal();
  animalPrompt.textContent = `${currentAnimal.name}가 배가 고파요!`;
  showImageOrEmoji(animalImage, animalEmoji, currentAnimal.image, currentAnimal.emoji, currentAnimal.name);
  const optionIds = chooseFoodOptions(currentAnimal.correctFood);
  foodOptions.replaceChildren(...optionIds.map(makeFoodButton));
  feedback.className = "feedback";
  feedback.textContent = "어떤 먹이를 좋아할까요?";
}

function startGame() {
  resetGameData();
  gameState = "playing";
  startScreen.hidden = true;
  gameScreen.hidden = false;
  startRound();
}

function endGame() {
  gameState = "start";
  resetGameData();
  gameScreen.hidden = true;
  startScreen.hidden = false;
  startButton.focus();
}

function handleAnswer(event) {
  if (gameState !== "playing" || !currentAnimal) return;
  const button = event.currentTarget;
  const selectedFood = button.dataset.foodId;

  if (selectedFood === currentAnimal.correctFood) {
    gameState = "feedback";
    stars += 1;
    starCount.textContent = String(stars);
    feedback.className = "feedback correct";
    feedback.textContent = "딩동댕! 잘했어요! ⭐";
    button.classList.add("correct-choice");
    foodOptions.querySelectorAll("button").forEach((item) => { item.disabled = true; });
    showCelebration();
    const sessionAtAnswer = gameSession;
    nextRoundTimer = window.setTimeout(() => {
      if (gameState !== "feedback" || gameSession !== sessionAtAnswer) return;
      gameState = "playing";
      startRound();
    }, 1500);
  } else {
    feedback.className = "feedback wrong";
    feedback.textContent = "앗, 다른 먹이를 찾아볼까요?";
    button.classList.add("wrong-choice");
    window.clearTimeout(wrongFeedbackTimer);
    wrongFeedbackTimer = window.setTimeout(() => button.classList.remove("wrong-choice"), 500);
  }
}

function showCelebration() {
  celebration.replaceChildren();
  const symbols = ["⭐", "✨", "🌟", "🎉", "⭐", "✨"];
  symbols.forEach((symbol, index) => {
    const sparkle = document.createElement("span");
    sparkle.className = "sparkle";
    sparkle.textContent = symbol;
    sparkle.style.left = `${10 + Math.random() * 80}%`;
    sparkle.style.top = `${35 + Math.random() * 50}%`;
    sparkle.style.animationDelay = `${index * 70}ms`;
    celebration.append(sparkle);
  });
  celebrationTimer = window.setTimeout(() => celebration.replaceChildren(), 1300);
}

startButton.addEventListener("click", startGame);
endButton.addEventListener("click", endGame);
