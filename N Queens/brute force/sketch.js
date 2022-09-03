let board;
let blockSize;
let n;
let slider;
let canIncrease;
function setup() {
    createCanvas(400, 520);
    textFont("bkamran");
    slider = createSlider(1, 12, 2);
    slider.position(20, 465);
    slider.size(200, 10);
    board = new Board(slider.value(), width / slider.value());
}

function draw() {
    if (slider.value() != board.n) {
        board = new Board(slider.value(), width / slider.value());
    }
    else {
        let c = color('#ED225D');
        // console.log();
        background(...c.levels);
        textSize(30);
        fill(0);

        textAlign(RIGHT);
        fill(255);
        stroke(0);
        strokeWeight(2);
        text("سایز صفحه: " + slider.value(), 380, 476);
        textAlign(CENTER);
        if (!board.allSafe())
            canIncrease = board.increase();
        if ((!canIncrease) && (!board.allSafe())) {
            textSize(25);
            text("!به نظر میاد با این سایز صفحه، هیچ راه حلی وجود نداره", width / 2 + 30, height - 20);
        }
        textSize(40);
        text("چک کردن همه حالات", width / 2 - 10, 35)
        translate(0, 50);
        board.show();
    }
}

class Board {
    constructor(n, blockSize) {
        this.code = 1;
        this.n = n;
        this.blockSize = blockSize;
        this.initializePoints();
    }
    initializePoints() {
        this.blocks = Array.from(Array(this.n).keys());
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
        strokeWeight(12 / this.n);
        noFill();
        square(0, 0, this.n * this.blockSize);
        strokeWeight();
        stroke(0);

    }
    showQueens() {
        fill(255, 0, 0);
        for (let i = 0; i < this.blocks.length; i++) {
            if (this.isThreatened(i))
                fill(255, 0, 0);
            else fill(0, 255, 0);
            let x = this.blocks[i] % this.n;
            let y = Math.floor(this.blocks[i] / this.n);
            stroke(0);
            strokeWeight(12 / this.n);
            circle((x + 0.5) * this.blockSize, (y + 0.5) * this.blockSize, this.blockSize / 2);
        }
    }
    allSafe() {
        for (let i = 0; i < this.n; i++) {
            if (this.isThreatened(i))
                return false;
        }
        return true;
    }
    isThreatened(index) {
        let x, y, X, Y;
        [x, y] = this.getXY(this.blocks[index]);
        for (let i = 0; i < this.blocks.length; i++) {
            if (i == index) continue;
            [X, Y] = this.getXY(this.blocks[i]);
            if (x == X || y == Y)
                return true;
            if (Math.abs(x - X) == Math.abs(y - Y))
                return true;
        }
        return false;
    }
    getXY(num) {
        return [num % this.n, Math.floor(num / this.n)];
    }
    increase() {
        this.code += 1;
        for (let i = this.n - 1; i >= 0; i--) {
            if (this.canIncrease(i)) {
                this.blocks[i] += 1;
                for (let I = i + 1; I < this.n; I++)
                    this.blocks[I] = this.blocks[i] + I - i;
                return true;
            }
        }
        return false;
    }
    canIncrease(index) {
        if ((index == this.n - 1)) {
            return this.blocks[index] < (this.n * this.n - 1);
        }
        return (this.blocks[index] + 1) != this.blocks[index + 1];
    }
}