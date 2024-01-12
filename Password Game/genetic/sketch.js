var target;
var maxPop;
var population;
var mutRate;
var finished = false;
var started = false;
let length;
let myButton;
let bestPhrase;
let allPhrases;
let stats;

function setup() {
    frameRate(18);
    target = "kaftare kakol be sar wifi.";
    maxPop = 200;
    mutRate = 0.01;
    population = new Population();
    myButton = createButton("START HACKING");
    myButton.position(50, 50);
    myButton.mousePressed(startHacking);
}

function draw() {
    background(255);
    if (!finished && started) {
        population.naturalSelection();
        displayInfo();
        population.generateGens();      
    }
    
}
function startHacking() {
  HTMLStuffs();
  started = true;
  myButton.remove();
}

function displayInfo() {
    let answer = population.bestDNA;

    bestPhrase.html("Best guess:<br>" + answer);

    let statstext = "total generations:     " + population.generations + "<br>";
    statstext += "best fitness:       " + nf(Math.floor(population.maxFitness * target.length)) + "<br>";
    statstext += "population size:      " + maxPop + "<br>";
    statstext += "mutation rate:         " + floor(mutRate * 100) + "%";

    stats.html(statstext);

    allPhrases.html("All guesses:<br>" + population.allPhrases());
}

function HTMLStuffs() {
    bestPhrase = createP("Best phrase:");
    bestPhrase.class("best");

    stats = createP("Stats");
    stats.class("stats");

    allPhrases = createP("All phrases:");
    allPhrases.position(400, 10);
    allPhrases.class("all");
}