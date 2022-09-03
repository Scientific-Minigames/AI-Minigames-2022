let board;
let blockSize;
let n;
let piecePicked;
let queenImage;
let attackButton;
let slider;

function setup() {
    createCanvas(400, 500);
    slider = createSlider(2, 16, 8);
    slider.position(200, 470);
    n = slider.value();
    blockSize = width / n;
    board = new Board(n, blockSize);
    attackButton = createButton("show threats");
    attackButton.mousePressed(flipAttack);
    attackButton.size(160, 40);
    attackButton.position(5, 455);
    textFont("bkamran");
}

function draw() {
    if (slider.value() != board.n) {
        board = new Board(slider.value(), width / slider.value());
        blockSize = width / slider.value();
    }
    let c = color('#ED225D');
    background(...c.levels);
    translate(0, 50);
    board.show();
    if (mouseIsPressed === true && piecePicked) {
        fill(255, 255, 0);
        stroke(0);
        strokeWeight(1);
        circle(mouseX, mouseY - 50, blockSize / 2 * 1.1);
    }
    fill(255);
    textSize(35);
    stroke(0);
    strokeWeight(2);
    textAlign(CENTER);
    text("قفل دریچه", width / 2, -20);
}


function mousePressed() {
    piecePicked = board.pick();
}


function mouseReleased() {
    board.place();
    piecePicked = false;
}

function flipAttack() {
    board.showThreats = !board.showThreats;
}

class Board {
    constructor(n, blockSize, points = null) {
        this.n = n;
        this.blockSize = blockSize;
        this.initializePoints();
        this.fitness = 0;
        this.picked = null;
        this.showThreats = false;
    }
    initializePoints() {
        let nums = shuffle(Array.from(Array(this.n * this.n).keys()));
        this.points = [];
        this.blocks = [];
        for (let i = 0; i < this.n; i++) {
            let x = nums[i] % this.n;
            let y = Math.floor(nums[i] / this.n);
            this.addQueen(x, y);
        }
    }
    addQueen(x, y) {
        this.blocks.push([x, y]);
        this.points.push(createVector((x + 0.5) * this.blockSize, (y + 0.5) * this.blockSize));
    }
    removeQueen(i) {
        this.blocks.splice(i, 1);
        this.points.splice(i, 1);
    }
    show() {
        // fill("#65DAF8");
        this.showBoard();
        fill(0);
        if (this.showThreats)
            this.showRays();
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
        strokeWeight(1);
        stroke(0);

    }
    showQueens() {
        fill(255, 0, 0);
        for (let i = 0; i < this.points.length; i++) {
            if (this.isThreatened(i))
                fill(255, 0, 0);
            else fill(0, 255, 0);
            // image(queenImage, this.points[i].x, this.points[i].y);
            stroke(0);
            strokeWeight(1);
            circle(this.points[i].x, this.points[i].y, this.blockSize / 2);
        }
    }
    allSafe() {
        if (piecePicked) return false;
        for (let i = 0; i < this.n; i++)
            if (this.isThreatened(i)) return false;
        return true;
    }
    isThreatened(index) {
        let x = this.blocks[index][0];
        let y = this.blocks[index][1];
        for (let i = 0; i < this.blocks.length; i++) {
            if (i == index) continue;
            let X = this.blocks[i][0];
            let Y = this.blocks[i][1];
            if (x == X || y == Y)
                return true;
            if (Math.abs(x - X) == Math.abs(y - Y))
                return true;
        }
        return false;
    }
    pick() {
        let mousePos = createVector(mouseX, mouseY - 50);
        for (let i = 0; i < this.n; i++) {
            let dist = p5.Vector.sub(this.points[i], mousePos).mag();
            // console.log(dist)
            if (dist < this.blockSize / 2) {
                this.picked = this.blocks[i];
                this.removeQueen(i);
                return true;
            }
        }
        return false;
    }
    place() {
        if (this.points.length == this.n) return false;
        if (mouseX > this.n * this.blockSize || mouseY - 50 > this.n * this.blockSize) {
            this.addQueen(...this.picked);
            return false;
        }
        let x = Math.floor(mouseX / this.blockSize);
        let y = Math.floor((mouseY - 50) / this.blockSize);
        for (let i = 0; i < this.points.length; i++) {
            let X = Math.floor(this.points[i].x / this.blockSize);
            let Y = Math.floor(this.points[i].y / this.blockSize);
            if (x == X && y == Y) {
                this.addQueen(...this.picked);
                return false;
            }
        }
        this.addQueen(x, y);
        return true;
    }
    showRays() {

        stroke(255, 0, 0);
        for (let i = 0; i < this.points.length; i++) {
            this.showRay(this.points[i].x, this.points[i].y);
        }
        stroke(0);
    }
    showRay(x, y) {
        line(x, 0, x, height);
        line(0, y, width, y);
        line(x - this.n * this.blockSize,
            y - this.n * this.blockSize,
            x + this.n * this.blockSize,
            y + this.n * this.blockSize);
        line(x + this.n * this.blockSize,
            y - this.n * this.blockSize,
            x - this.n * this.blockSize,
            y + this.n * this.blockSize);
    }
}