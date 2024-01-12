let counter;
let N;
let length = 10;
let font;
let chars = [
  'ا',
  'ب',
  'پ',
  'ت',
  'ث',
  'ج',
  'چ',
  'ح',
  'خ',
  'د',
  'ذ',
  'ر',
  'ز',
  'ژ',
  'س',
  'ش',
  'ص',
  'ض',
  'ط',
  'ظ',
  'ع',
  'غ',
  'ف',
  'ق',
  'ک',
  'گ',
  'ل',
  'م',
  'ن',
  'و',
  'ه',
  'ی',
  ' '
];
function preload() {
}
function setup() {
  createCanvas(300, 400);
  textFont("bkamran");
  N = pow(chars.length, length);
  counter = 0;
  textAlign(CENTER);

}

function draw() {
  background(220);
  textSize(50);
  text(mapToString(counter, 10), width / 2, height / 2 - 100);
  counter++;
  textSize(30);
  text(".از جوابها بررسی شده اند", width / 2, height / 2 + 140);
  
  let num = Math.floor(counter * 10000000000000/ N);
  let zeros = "0." + "0".repeat(11 - str(num).length);
  
  text(zeros + num + "%", width / 2, height / 2 + 100);
}

function mapToString(num, length) {
  let choices = chars.length;
  let res = [];
  for (let i = 0; i < length; i++) {
    res.push(chars[num % choices]);
    num = Math.floor(num / choices);
  }
  return res.join('');
}