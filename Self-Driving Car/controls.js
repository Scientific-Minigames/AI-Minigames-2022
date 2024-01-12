class Controls{
    constructor(type){
        this.left=false;
        this.right=false;
        this.forward=false;
        this.reverse=false;

        switch(type){
            case "KEYS":
                this.#addKeyboardListeners();
                break;
        }
    }

    #addKeyboardListeners(){
        document.onkeydown=(event)=>{
            switch(event.key){
                case "ArrowLeft":
                    this.left=true;
                    break;
                case "ArrowRight":
                    this.right=true;
                    break;
                // case "ArrowUp":
                //     this.forward=true;
                //     break;
                // case "ArrowDown":
                //     this.reverse=true;
                //     break;
            }
        }
        document.onkeyup=(event)=>{
            switch(event.key){
                case "ArrowLeft":
                    this.left=false;
                    break;
                case "ArrowRight":
                    this.right=false;
                    break;
                // case "ArrowUp":
                //     this.forward=false;
                //     break;
                // case "ArrowDown":
                //     this.reverse=false;
                //     break;
            }
        }
    }
}