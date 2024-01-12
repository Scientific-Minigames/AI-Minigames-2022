let scaler;
let iranImage;
let r;
let graph;
let points = [
    [44, 54],
    [78, 53],
    [118, 47],
    [147, 74],
    [181, 107],
    [192, 115], // tehran
    [123, 134],
    [126, 220],
    [72, 162],
    [93, 109],
    [81, 142],
    [113, 159],
    [150, 145],
    [173, 138],
    [198, 184],
    [219, 264],
    [173, 283],
    [305, 322],
    [325, 240],
    [420, 268],
    [373, 182],
    [378, 103], // mashhad
    [331, 74],
    [264, 83],
    [218, 98],
    [272, 119],
    [261, 206],
    [155, 102],
    [125, 89],
]
function preload() {
    iranImage = loadImage("iran.png");
}
function setup() {
    stroke(255, 0, 0);
    setScale();
    r = 1.3;
    n = points.length;
    createCanvas(500 / r, 400 / r);
    for (let i = 0; i < points.length; i++)
        points[i] = createVector(points[i][0] / r, points[i][1] / r);
    graph = new Graph(n, null, points);
}

function draw() {
    background(220);
    image(iranImage, 0, 0, width, height);
    graph.show();
    textSize(20);
    textAlign(LEFT);
    text("length:" + Math.floor(graph.score * scaler) + "km", 200, 30);
}

function setScale() {
    xt = points[5][0];
    yt = points[5][1];
    xm = points[points.length - 8][0];
    ym = points[points.length - 8][1];
    scaler = 736 / pow((xt - xm) * (xt - xm) + (yt - ym) * (yt - ym), 0.5)
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
        this.radius = 10;
        this.score = 0;
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
            if (p5.Vector.sub(mousePos, this.points[i]).mag() < this.radius)
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
            circle(this.points[i].x, this.points[i].y, this.radius);
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
        this.score = this.distance;
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