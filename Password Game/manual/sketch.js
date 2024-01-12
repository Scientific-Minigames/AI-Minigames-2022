let img;
let popSize = 7;
let currentPage = 0;
let showPage = 0;
let pastWords = [[]];
let pastScores = [[]];
let avgFitness = [];
let writeIndex = 0;
let humans;
let inp;
let password = 'تنور';
let foundPassword = false;

//buttons
let enterButton;
let nextButton;
let backButton;


function preload() {
  humans = [];
  for (let i = 0; i < 6; i++)
    humans.push(loadImage("human" + (i + 1) + ".png"));
  img = loadImage('image.png');
}
function setup() {
  textFont("bkamran");
  createCanvas(500, 300);
  
  enterButton = createButton('ورود');
  enterButton.position(150, 100);
  enterButton.mousePressed(checkPassword);
  
  nextButton = createButton("صفحه بعد");
  nextButton.position(380, 263);
  nextButton.mousePressed(nextPage);
  
  backButton = createButton("صفحه قبل");
  backButton.position(220, 263);
  backButton.mousePressed(backPage);
  
  inp = createInput('');
  inp.size(100);
  inp.position(enterButton.x - inp.width, enterButton.y);
}

function draw() {
  // let c = color('#ED225D');
  // background(...c.levels);
  background(255);
  image(img, width / 2 - 50, 0, img.width / 2, img.height / 2 + 5);
  writePastWords(260, 410, 65);
  showText();
}

function writePastWords(startX, endX, startY) {
  // console.log(pastWords);
  let words = pastWords[showPage];
  let scores = pastScores[showPage];
  let gap = 27.8;
  textSize(18);
  textAlign(CENTER);
  let y = startY;
  fill(255);
  text("صفحه " + (showPage + 1), endX, startY - 34);
  fill(0);
  text('کلمه', startX, y);
  text('حروف درست', endX - 20, y);
  y += 23;
  for (let i=0; i < words.length; i++) {
    text(words[i], startX, y);
    if (showPage < currentPage || words.length == popSize) {
      text(scores[i], endX - 10, y);
      showImage(scores);
    }
    y += gap;
  }
}
function showImage(scores) {
  let avg = scores.reduce((a, b) => a + b, 0) / (7 * scores.length);
  tint(255, 40);
  if (avg <= 0.06) {
    tint(255, 30);
    image(humans[0], width / 2, 40, humans[0].width * 1.6, humans[0].height * 1.7);
  }
  else if (avg <= 0.12)
    image(humans[1], width / 2 +15, 45, humans[1].width * 1.6, humans[1].height * 1.6);
  else if (avg <= 0.18)
    image(humans[2], width / 2 + 15, 40, humans[2].width * 1.4, humans[2].height * 1.4);
  else if (avg <= 0.24)
    image(humans[3], width / 2 + 28, 48, humans[3].width * 1.25, humans[3].height * 1.23);
  else if (avg <= 0.30)
    image(humans[4], width / 2 + 25, 43, humans[4].width * 1.14, humans[4].height * 1.14);
  else if (avg <= 1)
    image(humans[5], width / 2 + 33, 45, humans[5].width * 1.11, humans[5].height * 1.11);
  tint(255, 255);
}

function showText () {
  textAlign(LEFT);
  textSize(16);
  text(':رمز فایل را وارد کنید', inp.x, inp.y - 10);
  // textAlign(CENTER);
  if (inp.value().length != password.length) {
    fill(255, 0, 0);
    text('رمز دارای '+password.length+' حرف است', inp.x, inp.y + 40);
    fill(0);
  }
  textSize(14);
  if (foundPassword) {
    text('رمز درست بود.', inp.x - 20, inp.y + 50);
  }
}

function checkPassword() {
  if (inp.value().length != password.length || foundPassword || pastWords[showPage].length == popSize) {
    return;
  }
  correct = checkCorrects(inp.value(), password);
  pastScores[showPage].push(correct);
  pastWords[showPage].push(inp.value())
  if (correct == password.length)
    foundPassword = true;
}

function nextPage() {
  if (pastWords[showPage].length == popSize) {
    showPage += 1;
    if (currentPage < showPage) {
      currentPage = showPage;
      pastWords[showPage] = [];
      pastScores[showPage] = [];
    }
  }
}
function backPage() {
  if (showPage != 0) {
    showPage -= 1;
  }
}

function checkCorrects(word1, word2) {
  let corrects = 0;
  for (let i=0; i < min(word1.length, word2.length); i++) {
    if (word1[i] == word2[i]) {
      corrects += 1;
    }
  }
  return corrects;
}

function keyPressed() {
  if (keyCode === ENTER) {
    checkPassword();
  }
}