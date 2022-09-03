let invertButton;
let resetButton;
let invertInp;
let graph;
let n;
function setup() {
    createCanvas(500, 500);
    n = 5;
    graph = new Graph(n);
    console.log(graph.order);
    invertInp = createInput("123");
    invertInp.size(100)
    invertButton = createButton("invert");
    invertButton.mousePressed(inverse);
    resetButton = createButton("reset");
    resetButton.mousePressed(resetGraph);
}

function draw() {
    background(255);
    textSize(30);
    fill(0);
    textAlign(CENTER);
    text("inversion mini-game", width / 2, 30);
    graph.showEdges();
    graph.showPoints();
    graph.showOrder();
}

function resetGraph() {
    graph = new Graph(n);
}

function inverse() {
    intTour = [];
    tour = invertInp.value();
    for (let i = 0; i < tour.length; i++) {
        intTour.push(int(tour[i]));
    }
    if (graph.tourExists(intTour)) {
        let i = graph.order.indexOf(intTour[0]);
        let j = graph.order.indexOf(intTour[tour.length - 1]);
        graph.invert(i, j + 1);
    }
}

class Graph {
    constructor(n, order = null, points = null) {
        this.n = n;
        if (order != null) this.order = order;
        else this.initializeOrder();

        if (points != null) this.points = points;
        else this.initializePoints();
    }

    initializeOrder() {
        let nums = Array.from(Array(this.n - 1).keys()).map(num => num + 1);
        // this.order = shuffle(nums);
        this.order = nums;
    }
    initializePoints() {
        this.points = [];
        for (let i = 0; i < this.n; i++) {
            let x = (random() * 0.85 + 0.05) * width;
            let y = (random() * 0.85 + 0.05) * width;
            this.points.push(createVector(x, y));
        }
    }
    showPoints() {
        textAlign(CENTER);
        for (let i = 0; i < this.n; i++) {
            fill(255);
            circle(this.points[i].x, this.points[i].y, 18);
            fill(0);
            textSize(15);
            text(i, this.points[i].x, this.points[i].y + 5);
        }
    }
    showEdges() {
        noFill();
        beginShape();
        vertex(this.points[0].x, this.points[0].y);
        for (let i = 0; i < this.n - 1; i++) {
            let index = this.order[i]
            vertex(this.points[index].x, this.points[index].y);
        }
        endShape(CLOSE);
    }
    showOrder() {
        let txt = "0 " + this.order.join(" ") + " 0";
        textAlign(CENTER);
        textSize(20);
        text(txt, width / 2, height - 10);
    }
    invert(i, j) {
        let beginning = this.order.slice(0, min(i, j));
        let middle = this.order.slice(min(i, j), max(i, j));
        let end = this.order.slice(max(i, j));
        if (i < j)
            this.order = beginning.concat(middle.reverse()).concat(end);
        else
            this.order = (end.reverse()).concat(middle).concat(beginning.reverse());
    }
    tourExists(tour) {
        let begin = this.order.indexOf(tour[0]);
        if (begin == -1) return false;
        for (let i = 0; i < tour.length; i++) {
            if (tour[i] != this.order[i + begin])
                return false;
        }
        return true;
    }
}