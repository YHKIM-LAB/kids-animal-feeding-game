# 배고픈 동물에게 먹이를 주세요!

6살 어린이가 태블릿이나 컴퓨터에서 즐길 수 있는 간단한 동물 먹이주기 웹게임입니다. 별도 설치, 서버, 빌드 과정이 필요 없습니다.

처음에는 시작 화면이 나타납니다. **시작하기**를 누르면 별 0개로 게임이 시작되고, 게임 중 **종료하기**를 누르면 진행 상태와 별이 모두 초기화된 뒤 시작 화면으로 돌아갑니다.

## 실행 방법

1. 프로젝트 폴더의 `index.html`을 더블 클릭합니다.
2. 웹 브라우저에서 바로 게임을 즐깁니다.

Chrome, Edge, Safari 등 최신 브라우저를 권장합니다.

## 파일 구조

```text
kids-animal-feeding-game/
├── index.html          화면 구조
├── style.css           디자인과 반응형 레이아웃
├── game.js             게임 데이터와 동작
├── README.md
└── assets/
    ├── animals/        동물 PNG 이미지
    ├── foods/          먹이 PNG 이미지
    └── sounds/         추후 사용할 소리 파일
```

## 동물과 먹이

총 15종의 동물이 한 사이클에 한 번씩 무작위 순서로 출제됩니다.

- 토끼–당근, 판다–대나무, 원숭이–바나나
- 고양이–물고기, 강아지–뼈다귀, 코끼리–수박
- 기린–나뭇잎, 다람쥐–도토리, 펭귄–물고기
- 개구리–벌레, 소–풀, 말–건초
- 양–풀, 닭–옥수수, 돼지–고구마

## 이미지 교체 및 동물 추가 방법

현재는 PNG 파일이 없으면 이모지가 자동으로 표시됩니다. 아래 이름으로 투명 배경 PNG 파일을 추가하면 새로고침 후 자동으로 이미지가 표시됩니다.

- `assets/animals/`: `rabbit.png`, `panda.png`, `monkey.png`, `cat.png`, `dog.png` 등의 동물 이미지
- `assets/foods/`: `carrot.png`, `bamboo.png`, `banana.png`, `fish.png`, `bone.png` 등의 먹이 이미지

다른 파일명을 사용하려면 `game.js` 위쪽의 `ANIMALS`와 `FOODS` 데이터에 있는 `image` 경로를 수정합니다. 새 먹이는 `FOODS`에 고유 ID, 표시 이름, 이모지, 이미지 경로를 추가합니다. 새 동물은 `ANIMALS`에 ID, 이름, 이모지, 이미지 경로와 `correctFood` ID를 추가합니다. 같은 먹이를 먹는 동물은 기존 먹이 ID를 재사용할 수 있습니다.

## GitHub Pages 배포 방법

1. 이 폴더를 GitHub 저장소에 올립니다.
2. 저장소의 **Settings → Pages**로 이동합니다.
3. **Build and deployment**에서 **Deploy from a branch**를 선택합니다.
4. 배포할 브랜치(보통 `main`)와 `/ (root)` 폴더를 선택하고 **Save**를 누릅니다.
5. 잠시 후 Pages 화면에 표시되는 주소로 접속합니다.

모든 경로가 상대 경로이므로 추가 설정 없이 GitHub Pages에서 동작합니다.

처음 설정한 뒤에는 변경 사항을 커밋하여 GitHub의 Pages 배포 브랜치(보통 `main`)에 push하면 GitHub Pages가 새 파일을 자동으로 다시 배포합니다. 반영까지 잠시 시간이 걸릴 수 있습니다.
