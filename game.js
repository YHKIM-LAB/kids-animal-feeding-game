"use strict";

// PNG 파일을 아래 경로에 추가하면 이모지 대신 자동으로 표시됩니다.
const FOODS = {
  carrot: { name: "당근", emoji: "🥕", image: "assets/foods/carrot.png" },
  bamboo: { name: "대나무", emoji: "🎋", image: "assets/foods/bamboo.png" },
  banana: { name: "바나나", emoji: "🍌", image: "assets/foods/banana.png" },
  fish: { name: "생선", emoji: "🐟", image: "assets/foods/fish.png" },
  bone: { name: "뼈다귀", emoji: "🦴", image: "assets/foods/bone.png" }
};

const ANIMALS = [
  { id: "rabbit", name: "토끼", emoji: "🐰", image: "assets/animals/rabbit.png", correctFood: "carrot" },
  { id: "panda", name: "판다", emoji: "🐼", image: "assets/animals/panda.png", correctFood: "bamboo" },
  { id: "monkey", name: "원숭이", emoji: "🐵", image: "assets/animals/monkey.png", correctFood: "banana" },
  { id: "cat", name: "고양이", emoji: "🐱", image: "assets/animals/cat.png", correctFood: "fish" },
  { id: "dog", name: "강아지", emoji: "🐶", image: "assets/animals/dog.png", correctFood: "bone" }
];

const animalImage = document.querySelector("#animal-image");
const animalEmoji = document.querySelector("#animal-emoji");
const animalPrompt = document.querySelector("#animal-prompt");
const animalCard = document.querySelector("#animal-card");
const foodOptions = document.querySelector("#food-options");
const feedback = document.querySelector("#feedback");
const starCount = document.querySelector("#star-count");
const celebration = document.querySelector("#celebration");

let stars = 0;
let currentAnimal = null;
let lastAnimalId = null;
let isAnswerLocked = false;

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

function chooseAnimal() {
  const choices = ANIMALS.filter((animal) => animal.id !== lastAnimalId);
  return choices[Math.floor(Math.random() * choices.length)];
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

function startRound() {
  isAnswerLocked = false;
  currentAnimal = chooseAnimal();
  lastAnimalId = currentAnimal.id;
  animalPrompt.textContent = `${currentAnimal.name}가 배가 고파요!`;
  showImageOrEmoji(animalImage, animalEmoji, currentAnimal.image, currentAnimal.emoji, currentAnimal.name);

  const wrongFoods = shuffled(Object.keys(FOODS).filter((id) => id !== currentAnimal.correctFood)).slice(0, 2);
  const optionIds = shuffled([currentAnimal.correctFood, ...wrongFoods]);
  foodOptions.replaceChildren(...optionIds.map(makeFoodButton));
  feedback.className = "feedback";
  feedback.textContent = "어떤 먹이를 좋아할까요?";
  animalCard.classList.remove("success");
}

function handleAnswer(event) {
  if (isAnswerLocked) return;
  const button = event.currentTarget;
  const selectedFood = button.dataset.foodId;

  if (selectedFood === currentAnimal.correctFood) {
    isAnswerLocked = true;
    stars += 1;
    starCount.textContent = String(stars);
    feedback.className = "feedback correct";
    feedback.textContent = "딩동댕! 잘했어요! ⭐";
    button.classList.add("correct-choice");
    foodOptions.querySelectorAll("button").forEach((item) => { item.disabled = true; });
    showCelebration();
    window.setTimeout(startRound, 1500);
  } else {
    feedback.className = "feedback wrong";
    feedback.textContent = "앗, 다른 먹이를 찾아볼까요?";
    button.classList.add("wrong-choice");
    window.setTimeout(() => button.classList.remove("wrong-choice"), 500);
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
  window.setTimeout(() => celebration.replaceChildren(), 1300);
}

startRound();
