let population;
let N = 100;
let n = 15;
let maxGenerations = 1500;
let resetButton;
let mutationRate = 0.1;
let boardSize;
function setup() {
    createCanvas(400, 460);
    boardSize = min(width, height)
    population = new Population(N, n, mutationRate, boardSize, 100);

    resetButton = createButton("reset");
    resetButton.position(0, 405);
    resetButton.mousePressed(reinitialize);
}

function draw() {
    background(220);
    if (!population.foundAns) {
        population.calcThreats();
        // population.calcFitness();
        // console.log(population.best);
        population.calcFitness();
        population.setMatingPool();
        population.repopulate();
    }
    // else text("EZ", width / 2, height - 100);
    if (population.bestEver)
        population.bestEver.show();
    fill(0);
    textSize(20);
    text("generation: " + population.generation, 0, 450);
    // text(population.leastEverThreats, 100,50);
    // noLoop();
}

function reinitialize() {
    population.initialize();
}
class Population {
    constructor(N, n, mutationRate, boardSize, maxGeneration) {
        this.N = N;
        this.n = n;
        this.mutationRate = mutationRate;
        this.boardSize = boardSize;
        this.maxGeneration = maxGeneration;
        this.initialize();
    }
    initialize() {
        this.generation = 1;
        this.initializePopulation();
        this.bestEver = null;
        this.leastEverThreats = 1000000;
        this.best = null;
        this.foundAns = false;
    }
    initializePopulation() {
        this.population = [];
        for (let i = 0; i < this.N; i++) {
            this.population.push(new Board(this.n, null, this.boardSize));
        }
    }

    calcThreats() {
        this.mostThreats = 0;
        this.leastThreats = 100000;
        for (let i = 0; i < this.N; i++) {
            let threats = this.population[i].calcThreats();
            if (this.mostThreats < threats) {
                this.mostThreats = threats;
            }
            if (this.leastThreats > threats) {
                this.leastThreats = threats;
                this.best = this.population[i];
            }
        }
        if (this.leastEverThreats > this.leastThreats) {
            this.leastEverThreats = this.leastThreats;
            this.foundAns = this.leastEverThreats == 0;
            this.bestEver = this.best;
        }
    }

    calcFitness() {
        for (let i = 0; i < this.N; i++) {
            this.population[i].fitness =
                (this.mostThreats - this.population[i].threats + 0.001) /
                (this.mostThreats - this.leastThreats + 0.001);
        }
    }

    setMatingPool(multiplier = 3) {
        this.matingPool = [];
        for (let i = 0; i < this.N; i++) {
            for (let j = 0; j < Math.floor(this.population[i].fitness * multiplier); j++) {
                this.matingPool.push(i);
            }
        }
    }

    repopulate() {
        if (this.generation > this.maxGeneration) {
            this.initialize();
            return;
        }
        let newPopulation = [];
        for (let i = 0; i < this.N / 2; i++) {
            let i1 = random(this.matingPool);
            let parent1 = this.population[i1];
            let parent2 = this.population[random(this.matingPool)];
            let I = Math.floor(random() * (this.n));
            let J = Math.floor(random() * (this.n));
            let child1 = parent1.crossover(parent2, I, J);
            let child2 = parent2.crossover(parent1, I, J);
            child1.mutate(this.mutationRate);
            child2.mutate(this.mutationRate);
            newPopulation.push(child1);
            newPopulation.push(child2);
        }
        this.population = newPopulation;
        this.generation += 1;
    }
}

class Board {
    constructor(n, order = null, boardSize = 100) {
        this.n = n;
        if (order != null) this.order = order;
        else this.initializeOrder();
        this.boardSize = boardSize;
        this.blockSize = boardSize / n;
        this.fitness = 0;
    }
    initializeOrder() {
        let nums = Array.from(Array(this.n).keys());
        this.order = shuffle(nums);
    }
    show() {
        this.showBoard();
        this.showQueens();
    }
    showBoard() {
        strokeWeight(0);
        for (let i = 0; i < this.n; i++) {
            for (let j = 0; j < this.n; j++) {
                if ((i + j) % 2 == 0) {
                    fill("#65DAF8");
                }
                else
                    fill(255);
                square(this.blockSize * i, this.blockSize * j, this.blockSize);
            }
        }
        stroke(255);
        strokeWeight(3);
        noFill();
        square(0, 0, this.n * this.blockSize);
        stroke(0);

    }

    showQueens() {
        for (let i = 0; i < this.n; i++) {
            if (this.isThreatened(i))
                fill(255, 0, 0);
            else fill(0, 255, 0);
            // image(queenImage, this.points[i].x, this.points[i].y);
            stroke(0);
            strokeWeight(1);
            circle((i + 0.5) * this.blockSize, (this.order[i] + 0.5) * this.blockSize, this.blockSize / 2);
        }
    }
    isThreatened(index) {
        let x = index;
        let y = this.order[index];
        for (let i = 0; i < this.n; i++) {
            if (i == index) continue;
            let X = i;
            let Y = this.order[i];
            if (x == X || y == Y)
                return true;
            if (Math.abs(x - X) == Math.abs(y - Y))
                return true;
        }
        return false;
    }

    calcThreats() {
        let count = 0;
        for (let i = 0; i < this.n; i++) {
            if (this.isThreatened(i))
                count += 1;
        }
        this.threats = count;
        return count;
    }

    mutate(mutationRate = 0.01) {
        if (random() < mutationRate) {
            let i = Math.floor(random() * (this.n));
            let j = Math.floor(random() * (this.n));
            [this.order[i], this.order[j]] = [this.order[j], this.order[i]]
        }
    }
    crossover(other, I, J) {
        let order1 = this.order;
        let order2 = other.order;

        let childOrder = [...this.order];
        // console.log(childOrder);
        [I, J] = [min(I, J), max(I, J)];
        for (let i = 0; i < this.n; i++) {
            if (i >= I && i < J) {
                continue;
            }
            childOrder[i] = -1;
        }
        // console.log(childOrder);
        let index = 0;
        for (let i = 0; i < this.n; i++) {
            if (childOrder[i] != -1) continue;
            while (childOrder.includes(order2[index])) {
                index += 1;
            }
            childOrder[i] = order2[index];
        }
        // console.log(childOrder);
        return new Board(this.n, childOrder, this.boardSize);
    }
}