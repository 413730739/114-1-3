let allQuestions = [
  { question: "蘋果的英文是？", options: ["Apple", "Banana", "Cat", "Dog"], answer: 0 },
  { question: "球的英文是？", options: ["Box", "Ball", "Bag", "Book"], answer: 1 },
  { question: "貓的英文是？", options: ["Cow", "Cat", "Car", "Cap"], answer: 1 },
  { question: "狗的英文是.？", options: ["Duck", "Deer", "Dog", "Doll"], answer: 2 },
  { question: "大象的英文是？", options: ["Eagle", "Elephant", "Ear", "Egg"], answer: 1 },
  { question: "魚的英文是？", options: ["Fan", "Fox", "Frog", "Fish"], answer: 3 },
  { question: "禮物的英文是？", options: ["Gold", "Game", "Gift", "Goat"], answer: 2 },
  { question: "房子的英文是？", options: ["House", "Hand", "Hat", "Horse"], answer: 0 },
  { question: "冰的英文是？", options: ["Ink", "Ice", "Iron", "Island"], answer: 1 },
  { question: "果醬的英文是？", options: ["Juice", "Jam", "Jeans", "Job"], answer: 1 },
  { question: "鑰匙的英文是？", options: ["King", "Kite", "Key", "Kid"], answer: 2 },
  { question: "獅子的英文是？", options: ["Lamb", "Lion", "Leaf", "Leg"], answer: 1 },
  { question: "牛奶的英文是？", options: ["Moon", "Mouse", "Milk", "Map"], answer: 2 },
  { question: "巢的英文是？", options: ["Nail", "Nose", "Net", "Nest"], answer: 3 },
  { question: "橘子的英文是？", options: ["Onion", "Orange", "Octopus", "Olive"], answer: 1 },
  { question: "鋼筆的英文是？", options: ["Pen", "Pig", "Pan", "Pin"], answer: 0 },
  { question: "女王的英文是？", options: ["Queen", "Quick", "Question", "Quilt"], answer: 0 },
  { question: "兔子的英文是？", options: ["Rat", "Rope", "Rabbit", "Rose"], answer: 2 },
  { question: "太陽的英文是？", options: ["Snow", "Sky", "Star", "Sun"], answer: 3 },
  { question: "老虎的英文是？", options: ["Tree", "Tiger", "Toy", "Table"], answer: 1 },
  { question: "雨傘的英文是？", options: ["Under", "Up", "Umbrella", "Uniform"], answer: 2 },
  { question: "小提琴的英文是？", options: ["Van", "Vase", "Vest", "Violin"], answer: 3 },
  { question: "水的英文是？", options: ["Watch", "Wall", "Water", "Wind"], answer: 2 },
  { question: "X光的英文是？", options: ["X-ray", "Box", "Mix", "Fix"], answer: 0 },
  { question: "黃色的英文是？", options: ["Young", "Yes", "Yellow", "Yesterday"], answer: 2 },
  { question: "斑馬的英文是？", options: ["Zoo", "Zero", "Zebra", "Zip"], answer: 2 }
];

let quizQuestions = [];
let currentQuestionIndex = 0;
let selectedAnswer = -1;
let score = 0;
let gameState = 'answering'; // answering, showingAnswer, gameOver
let fireworks = [];

// 按鈕位置和大小
let optionButtons = [];
let submitButton;
let nextButton;
let restartButton;

class Firework {
  constructor(x, y) {
    this.particles = [];
    for (let i = 0; i < 100; i++) {
      this.particles.push(new Particle(x, y));
    }
  }

  update() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update();
      if (this.particles[i].isFinished()) {
        this.particles.splice(i, 1);
      }
    }
  }

  draw() {
    this.particles.forEach(p => p.draw());
  }

  isDone() {
    return this.particles.length === 0;
  }
}

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(2, 8));
    this.lifespan = 255;
    this.color = color(random(255), random(255), random(255));
  }

  update() {
    this.pos.add(this.vel);
    this.vel.mult(0.95);
    this.lifespan -= 4;
  }

  draw() {
    noStroke();
    fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], this.lifespan);
    ellipse(this.pos.x, this.pos.y, 8);
  }

  isFinished() {
    return this.lifespan < 0;
  }
}

function setupButtons() {
  let buttonWidth = 200;
  let buttonHeight = 50;
  let startX = width / 2 - buttonWidth * 1.1;
  let startY = height / 2;

  optionButtons = [];
  for (let i = 0; i < 4; i++) {
    optionButtons.push({
      x: startX + (i % 2) * (buttonWidth * 1.2),
      y: startY + floor(i / 2) * (buttonHeight * 1.2),
      w: buttonWidth,
      h: buttonHeight,
      label: ['A', 'B', 'C', 'D'][i]
    });
  }

  submitButton = { x: width / 2 - 100, y: height - 150, w: 200, h: 50, label: '送出' };
  nextButton = { x: width / 2 - 100, y: height - 80, w: 200, h: 50, label: '下一題' };
  restartButton = { x: width / 2 - 100, y: height / 2 + 100, w: 200, h: 50, label: '再一次' };
}

function startQuiz() {
  quizQuestions = shuffle(allQuestions).slice(0, 10);
  currentQuestionIndex = 0;
  score = 0;
  selectedAnswer = -1;
  gameState = 'answering';
  fireworks = [];
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  startQuiz();
  setupButtons();
  textAlign(CENTER, CENTER);
}

function draw() {
  background("#F5F5DC"); // 米白色

  if (gameState === 'gameOver') {
    drawGameOver();
  } else {
    drawQuestion();
    drawOptions();
    if (gameState === 'answering') {
      drawButton(submitButton);
    } else if (gameState === 'showingAnswer') {
      drawNextButton();
    }
  }

  fireworks.forEach(fw => {
    fw.update();
    fw.draw();
  });
  fireworks = fireworks.filter(fw => !fw.isDone());
}

function drawQuestion() {
  let q = quizQuestions[currentQuestionIndex];
  textSize(48);
  fill(0);
  text(q.question, width / 2, height / 4);
}

function drawOptions() {
  let q = quizQuestions[currentQuestionIndex];
  for (let i = 0; i < optionButtons.length; i++) {
    let btn = optionButtons[i];
    let btnColor = color(220);

    if (gameState === 'showingAnswer') {
      if (i === q.answer) {
        btnColor = color(0, 255, 0); // 正確答案為綠色
      } else if (i === selectedAnswer) {
        btnColor = color(255, 0, 0); // 選錯為紅色
      }
    } else if (i === selectedAnswer) {
      btnColor = color(150, 150, 255); // 選中為藍色
    }

    fill(btnColor);
    rect(btn.x, btn.y, btn.w, btn.h, 10);
    fill(0);
    textSize(24);
    text(`${btn.label}. ${q.options[i]}`, btn.x + btn.w / 2, btn.y + btn.h / 2);
  }
}

function drawButton(btn) {
  fill(200);
  rect(btn.x, btn.y, btn.w, btn.h, 10);
  fill(0);
  textSize(24);
  text(btn.label, btn.x + btn.w / 2, btn.y + btn.h / 2);
}

function drawNextButton() {
  if (currentQuestionIndex < quizQuestions.length - 1) {
    drawButton(nextButton);
  } else {
    drawButton({ ...nextButton, label: '查看結果' });
  }
}

function drawGameOver() {
  textSize(64);
  fill(0);
  text(`測驗結束！`, width / 2, height / 2 - 50);
  textSize(48);
  if (score <= 5) {
    fill(255, 0, 0); // 分數低於等於5題時顯示紅色
  } else {
    fill(0);
  }
  text(`你的分數: ${score} / 10`, width / 2, height / 2 + 20);
  fill(0); // 恢復預設顏色以繪製按鈕
  drawButton(restartButton);
}

function mousePressed() {
  if (gameState === 'answering') {
    for (let i = 0; i < optionButtons.length; i++) {
      let btn = optionButtons[i];
      if (mouseX > btn.x && mouseX < btn.x + btn.w && mouseY > btn.y && mouseY < btn.y + btn.h) {
        selectedAnswer = i;
        return;
      }
    }
    if (mouseX > submitButton.x && mouseX < submitButton.x + submitButton.w && mouseY > submitButton.y && mouseY < submitButton.y + submitButton.h) {
      if (selectedAnswer !== -1) {
        gameState = 'showingAnswer';
        if (selectedAnswer === quizQuestions[currentQuestionIndex].answer) {
          score++;
          fireworks.push(new Firework(width / 2, height / 2));
        }
      }
    }
  } else if (gameState === 'showingAnswer') {
    if (mouseX > nextButton.x && mouseX < nextButton.x + nextButton.w && mouseY > nextButton.y && mouseY < nextButton.y + nextButton.h) {
      currentQuestionIndex++;
      if (currentQuestionIndex < quizQuestions.length) {
        selectedAnswer = -1;
        gameState = 'answering';
      } else {
        gameState = 'gameOver';
        if (score >= 8) {
          for (let i = 0; i < 10; i++) {
            fireworks.push(new Firework(random(width), random(height / 2)));
          }
        }
      }
    }
  } else if (gameState === 'gameOver') {
    if (mouseX > restartButton.x && mouseX < restartButton.x + restartButton.w && mouseY > restartButton.y && mouseY < restartButton.y + restartButton.h) {
      startQuiz();
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setupButtons();
}
