const playCanvas = document.getElementById("playCanvas");
playCanvas.width = 200;
const AICanvas = document.getElementById("AICanvas");
AICanvas.width = 200;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

const playCtx = playCanvas.getContext("2d");
const AICtx = AICanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");
var populationDied = false;

const playRoad = new Road(playCanvas.width / 2, playCanvas.width * 0.9, 3);
const AIroad = new Road(AICanvas.width / 2, AICanvas.width * 0.9, 3);

// algorithm parameters:
const N = 30;
const mutationAmount = 1;

var playCar = new Car(playRoad.getLaneCenter(1), 100, "KEYS");

var AIpopulation = new Population(N, mutationAmount, AIroad);
// for (let j=0; j < AIpopulation.cars.length; j++) {
//     AIpopulation.cars[j].brain.levels[0].weights[0] = [-0.1, 0.1];
//     AIpopulation.cars[j].brain.levels[0].weights[1] = [-1, 1];
//     AIpopulation.cars[j].brain.levels[0].weights[2] = [0.3, 0.3];
//     AIpopulation.cars[j].brain.levels[0].weights[3] = [1, -1];
//     AIpopulation.cars[j].brain.levels[0].weights[0] = [0.1, -0.1];
//     AIpopulation.cars[j].brain.levels[0].biases = [0.5, 0.5];
// }

let bestCar = AIpopulation.cars[0];
// if(localStorage.getItem("bestBrain")){
//     for(let i=0;i<AIpopulation.length;i++){
//         AIpopulation[i].brain=JSON.parse(
//             localStorage.getItem("bestBrain"));
//         if(i!=0){
//             [AIpopulation[i-1].brain,AIpopulation[i].brain]=NeuralNetwork.crossover(AIpopulation[i].brain,AIpopulation[i-1].brain);
//         }
//     }
// }



var AITraffic = generateTraffic(AIroad);
var playTraffic = generateTraffic(playRoad);

animate();

// function save() {
//     localStorage.setItem("bestBrain",
//         JSON.stringify(bestCar.brain));
// }

// function discard() {
//     localStorage.removeItem("bestBrain");
// }

function reset(){
    // reset playCar
    playCar = new Car(playRoad.getLaneCenter(1), 100, "KEYS");
    playTraffic = generateTraffic(playRoad);

}

function generateAICars(N) {
    const cars = [];
    for (let i = 1; i <= N; i++) {
        // r = Math.floor(Math.random() * 3)
        cars.push(new Car(AIroad.getLaneCenter(1), 100, "AI", maxSpeed = 4));
    }
    return cars;
}

function generateTraffic(road) {
    let traffic = [];
    for (let i = -20; i < 80; i++) {
        // if (i == 0)
        //     continue;
        y = - (i * 240) - 30;
        randomOffset = Math.floor(Math.random() * 50) - 25;
        lane1 = Math.floor(Math.random() * road.laneCount);
        lane2 = (lane1 + 1) % road.laneCount;

        traffic.push(new Car(road.getLaneCenter(lane1), y, "DUMMY", maxSpeed = 2, color = getRandomColor()));

        traffic.push(new Car(road.getLaneCenter(lane2), y + randomOffset, "DUMMY", maxSpeed = 2, color = getRandomColor()));
    }
    return traffic;
}

function animate(time) {
    for (let i = 0; i < AITraffic.length; i++) {
        AITraffic[i].update([], []);
        playTraffic[i].update([], []);
    }
    for (let i = 0; i < AIpopulation.cars.length; i++) {
        AIpopulation.cars[i].update(AIroad.borders, AITraffic);
    }
    playCar.update(playRoad.borders, playTraffic);
    bestCar = AIpopulation.cars.find(
        c => c.y == Math.min(
            ...AIpopulation.cars.map(c => c.y)
        ));

    var flag = 1;
    for (let i = 0; i < AIpopulation.cars.length; i++) {
        if (AIpopulation.cars[i].damaged == false) {
            flag = 0
            break;
        }
    }
    if (flag) {
        populationDied = true;
    }
    playCanvas.height = window.innerHeight;
    AICanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    AICtx.save();
    AICtx.translate(0, -bestCar.y + AICanvas.height * 0.7);

    playCtx.save();
    playCtx.translate(0, -playCar.y + playCanvas.height * 0.7);

    AIroad.draw(AICtx);
    playRoad.draw(playCtx);

    for (let i = 0; i < AITraffic.length; i++) {
        AITraffic[i].draw(AICtx);
        playTraffic[i].draw(playCtx);
    }
    AICtx.globalAlpha = 0.2;
    for (let i = 0; i < AIpopulation.cars.length; i++) {
        AIpopulation.cars[i].draw(AICtx);
    }
    AICtx.globalAlpha = 1;
    bestCar.draw(AICtx, true);
    playCar.draw(playCtx, true);

    AICtx.restore();
    playCtx.restore();
    networkCtx.lineDashOffset = -time / 50;
    Visualizer.drawNetwork(networkCtx, bestCar.brain);
    requestAnimationFrame(animate);
    if (populationDied) {
        AIpopulation.repopulatie();
        populationDied = false;
        AITraffic = generateTraffic(AIroad);
    }
}