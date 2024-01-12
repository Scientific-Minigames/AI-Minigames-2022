let n;

let graph;

function preload() {
    txt = loadStrings('points.txt');
}


function setup() {
    loadedPoints = [];
    for (let i = 0; i < txt.length; i++) {
        [x, y] = txt[i].split(",").map(Number);
        loadedPoints.push(createVector(x / 2, y / 2));
    }
    n = loadedPoints.length;
    createCanvas(500, 300);
    graph = new Graph(n, null, loadedPoints);
    stroke(0);
    strokeWeight(1);
}

function draw() {
    background(220);
    graph.show();
    text("path length: " + graph.distance, 80, 20);
}

function mousePressed() {
    graph.selecting = true;
}

function mouseReleased() {
    graph.selecting = false;
    if (graph.selected.length == n) {
        graph.order = [...graph.selected];
        graph.calcDistance();
    }
    graph.selected = [];
}

class Graph {
    constructor(n, order = null, points = null) {
        this.n = n;
        this.order = order;
        // this.distance = 0;
        this.selected = [];
        this.selectiing = false;
        if (points != null) this.points = points;
        else this.initializePoints();
    }

    initializePoints() {
        this.points = [];
        for (let i = 0; i < this.n; i++) {
            let x = (random() * 0.85 + 0.05) * width;
            let y = (random() * 0.85 + 0.05) * width;
            this.points.push(createVector(x, y));
        }
    }
    show() {
        if (mouseIsPressed) {
            this.addSelection();
            this.showSelected();
        }
        this.showEdges();
        this.showPoints();
    }

    addSelection() {
        for (let i = 0; i < this.n; i++) {
            if (this.selected.includes(i)) continue;
            let mousePos = createVector(mouseX, mouseY);
            if (p5.Vector.sub(mousePos, this.points[i]).mag() < 18)
                this.selected.push(i);
        }
    }
    showSelected() {
        noFill();
        stroke(255, 0, 0);
        strokeWeight(3);
        beginShape();
        for (let i = 0; i < this.selected.length; i++) {
            let index = this.selected[i];
            vertex(this.points[index].x, this.points[index].y);
        }
        if (this.selected.length == n)
            vertex(this.points[this.selected[0]].x, this.points[this.selected[0]].y);
        else
            vertex(mouseX, mouseY);
        endShape();
        stroke(0);
        strokeWeight(1);
    }
    showPoints() {
        textAlign(CENTER);
        for (let i = 0; i < this.n; i++) {
            fill(255);
            circle(this.points[i].x, this.points[i].y, 18);
            fill(0);
            textSize(15);
        }
    }
    calcDistance() {
        this.distance = 0;
        for (let i = 0; i < this.n; i++) {
            let index1 = this.order[i];
            let index2 = this.order[(i + 1) % this.n];
            this.distance += p5.Vector.sub(this.points[index1], this.points[index2]).mag();
        }
        return this.distance;
    }
    showEdges() {
        if (this.order == null) return;
        noFill();
        beginShape();
        for (let i = 0; i < this.n; i++) {
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
}