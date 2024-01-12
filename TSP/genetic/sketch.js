let population;
let N = 150;
// let n = 25;
let mutationRate = 0.15;
let txt;
let loadedPoints;
let reset;


function preload() {
    txt = loadStrings('points.txt');
}
function setup() {
    reset = createButton("reset");
    reset.mousePressed(resetPopulation);
    reset.size(100, 30);
    reset.position(25, 325);
    createCanvas(500, 400);
    loadedPoints = [];
    population = [];

    for (let i = 0; i < txt.length; i++) {
        [x, y] = txt[i].split(",").map(Number);
        loadedPoints.push(createVector(x / 2, y / 2));
    }
    n = loadedPoints.length;
    population = new Population(N, n, mutationRate, loadedPoints);
}

function draw() {
    background(220);
    population.calcDistance();
    population.bestEver.show();
    // translate(0, height / 2);
    // population.best.show();
    population.calcFitness();
    population.setMatingPool();
    population.repopulate();
    textAlign(CENTER)
    textSize(30);
    text("طول دور: " + Math.floor(population.bestEverDistance * 10) / 100, width / 2, height - 50);
    // noLoop();
}

function resetPopulation() {
    population = new Population(N, n, mutationRate, loadedPoints);
}

class Population {
    constructor(N, n, mutationRate, points = null) {
        this.generation = 0;
        this.N = N;
        this.n = n;
        this.mutationRate = mutationRate;
        if (points == null)
            this.initializePoints();
        else
            this.points = points;
        this.initializePopulation();
        this.bestEver = null;
        this.bestEverDistance = 100000;
        this.best = null;
    }
    initializePopulation() {
        this.population = [];
        for (let i = 0; i < this.N; i++) {
            this.population.push(new Graph(n, this.points, null));
        }
    }

    initializePoints() {
        this.points = [];
        for (let i = 0; i < this.n; i++) {
            let x = (random() * 0.85 + 0.05) * width;
            let y = (random() * 0.85 + 0.05) * height / 2;
            this.points.push(createVector(x, y));
        }
    }
    calcDistance() {
        this.worstDistance = 0;
        this.bestDistance = 100000;
        for (let i = 0; i < this.N; i++) {
            let distance = this.population[i].calcDistance();
            if (this.worstDistance < distance) {
                this.worstDistance = distance;
            }
            if (this.bestDistance > distance) {
                this.bestDistance = distance;
                this.best = this.population[i];
            }
        }
        if (this.bestEverDistance > this.bestDistance) {
            this.bestEverDistance = this.bestDistance;
            this.bestEver = this.best;
        }
    }

    calcFitness() {
        for (let i = 0; i < this.N; i++) {
            this.population[i].fitness =
                (this.worstDistance - this.population[i].distance + 0.001) /
                (this.worstDistance - this.bestDistance + 0.001);
        }
    }

    setMatingPool(multiplier = 2.5) {
        this.matingPool = [];
        for (let i = 0; i < this.N; i++) {
            for (let j = 0; j < Math.floor(this.population[i].fitness * multiplier); j++) {
                this.matingPool.push(i);
            }
        }
    }

    repopulate() {
        let newPopulation = [];
        for (let i = 0; i < this.N / 2; i++) {
            let i1 = random(this.matingPool);
            let parent1 = this.population[i1];
            let parent2 = this.population[random(this.matingPool)];
            let I = Math.floor(random() * (this.n - 1));
            let J = Math.floor(random() * (this.n - 1));
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


class Graph {
    constructor(n, points, order = null) {
        this.n = n;
        if (order != null) this.order = order;
        else this.initializeOrder();
        this.points = points;
        // if (points != null) this.points = points;
        // else this.initializePoints();
        this.fitness = 0;
    }
    initializeOrder() {
        let nums = Array.from(Array(this.n - 1).keys()).map(num => num + 1);
        this.order = shuffle(nums);
    }

    calcDistance() {
        this.distance = 0;
        let index = 0;
        for (let i = 0; i < this.n - 1; i++) {
            let nextIndex = this.order[i];
            this.distance += p5.Vector.sub(this.points[index], this.points[nextIndex]).mag();
            index = nextIndex;
        }
        this.distance += p5.Vector.sub(this.points[0], this.points[index]).mag();
        return this.distance;
    }
    show() {
        this.showEdges();
        this.showPoints();
    }
    showPoints() {
        textAlign(CENTER);
        for (let i = 0; i < this.n; i++) {
            fill(255);
            circle(this.points[i].x, this.points[i].y, 15);
            fill(0);
            textSize(12);
            text(i, this.points[i].x, this.points[i].y + 5);
        }
    }
    showEdges() {
        noFill();
        beginShape();
        vertex(this.points[0].x, this.points[0].y);
        for (let i = 0; i < this.n - 1; i++) {
            let index = this.order[i];
            vertex(this.points[index].x, this.points[index].y);
        }
        endShape(CLOSE);
    }
    invert(i, j) {
        if (i == j) return;
        let beginning = this.order.slice(0, min(i, j));
        let middle = this.order.slice(min(i, j), max(i, j));
        let end = this.order.slice(max(i, j));
        // if (i < j)
        this.order = beginning.concat(middle.reverse()).concat(end);
        // else
        // this.order = (end.reverse()).concat(middle).concat(beginning.reverse());
    }

    mutate(mutationRate = 0.01) {
        if (random() < mutationRate) {
            let i = Math.floor(random() * (this.n - 1));
            let j = Math.floor(random() * (this.n - 1));
            this.invert(min(i, j), max(i, j));
        }
    }
    crossover(other, I, J) {
        let order1 = this.order;
        let order2 = other.order;
        let childOrder = [...this.order];
        [I, J] = [min(I, J), max(I, J)];
        for (let i = 0; i < this.n - 1; i++) {
            if (i >= I && i < J) {
                continue;
            }
            childOrder[i] = 0;
        }
        let index = 0;
        for (let i = 0; i < this.n - 1; i++) {
            if (childOrder[i] != 0) continue;
            while (childOrder.includes(order2[index])) {
                index += 1;
            }
            childOrder[i] = order2[index];
        }
        return new Graph(this.n, this.points, childOrder);
    }
    crossover2(other, I, J) {
        let order1 = this.order;
        let order2 = other.order;
        let childOrder = [...this.order];
        [I, J] = [min(I, J), max(I, J)];
        for (let i = 0; i < this.n - 1; i++) {
            if (i >= I && i < J) {
                continue;
            }
            childOrder[i] = 0;
        }
        let index = Math.floor(random() * (this.n - 1));
        for (let i = 0; i < this.n - 1; i++) {
            if (childOrder[i] != 0) continue;
            while (childOrder.includes(order2[index])) {
                index = (index + 1) % (this.order - 1);
            }
            childOrder[i] = order2[index];
        }
        return new Graph(this.n, this.points, childOrder);
    }
}