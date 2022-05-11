const prompt = require('prompt-sync')({sigint: true});
const clear = require('clear-screen');

class Game {

    constructor(col = 10, row = 10) {
        this._field = [];
        this._row = row;
        this._col = col;
        this._playerX = 0;
        this._playerY = 0;
        this._belowPlayer = '';
        this._gameRunning = false;
        this._continueGame = false;

        this._messages = [];
        /*
        Instructions Legend:
        [0] Game Controls
        [1] Movement Controls
        [2] Goal Message
        [3] Hole Message
        [4] Out of Bounds Message
        [5] GameRunning false Message
        [6] Invalid Entry Message
        [7] Quit Message
        */
        
        for (let m = 0; m < 10; m++){
            this._messages.push('');
        }
        
        this._messages[0] = (`\
Controls:
'N' to restart the current map.
'M' to restart with a new map.
'Q' to Quit.
'I' to view instructions.`);
        this._messages[1] = (`\
Move with:
'W' to move up.
'A' to move left.
'S' to move down.
'D' to move right.`);
        this._messages[2] = (`Congratulations! You Win!!`);
        this._messages[3] = (`Game Over! Player fell into a hole~`);
        this._messages[4] = (`Game Over! Player out of bounds~`);
        this._messages[5] = (`Please start a New Game with 'N'/'M' or Quit with 'Q'`);
        this._messages[6] = (`Invalid Entry. Please enter another action or I for instructions`);
        this._messages[7] = (`Thanks for playing~!`);
        this._messages[8] = (`Get to the ۞ to find your hat~ Try to avoid falling off~`);
        this._messages[9] = ('');

        this._currentState = 9;

        this._playerCharacter = '℗';
        this._goalCharacter = '۞';
        this._fieldCharacter = '░';
        this._holeCharacter = '█';
    }

    generateField() {

        for (let y = 0; y < this._row ; y++) {
            this._field [y] = []
        }

        for (let y = 0; y < this._row; y++) {
            let trapHoles = 0;
            for (let x = 0; x < this._col; x++) {
                if ( (Math.random() * 5) < 1 && trapHoles < 2){this._field[y][x] = this._holeCharacter;trapHoles++;}
                else{this._field[y][x] = this._fieldCharacter;}
            }
        }

        
    }

    print() {
        clear();
        const displayString = this._field.map(row => {
            return row.join('')
        }).join('\n');
        console.log(displayString);
        console.log(this._messages[this._currentState]);
    }

    placePlayer() {
        if (this._playerX != 0 || this._playerY != 0){
            if (!(this._playerY >= this._row || this._playerY < 0 || this._playerX >= this._col || this._playerX < 0)){
                this._field[this._playerY][[this._playerX]] = this._belowPlayer
            }
        }
        this._playerX = 0;
        this._playerY = 0;
        this._belowPlayer = '░';
        this._field[this._playerY][this._playerX] = this._playerCharacter;
    }

    askQuestion(){
        let replied = false;
        const answer = prompt('What will the player do?: ').toLowerCase();

        if (this._gameRunning){

            switch (answer) {
                case 'w':
                    this.moveCharacter(this._playerX,(this._playerY - 1));
                    replied = true;
                    break;
                case 's':
                    this.moveCharacter(this._playerX,(this._playerY + 1));
                    replied = true;
                    break;
                case 'a':
                    this.moveCharacter((this._playerX - 1),this._playerY );
                    replied = true;
                    break;
                case 'd':
                    this.moveCharacter((this._playerX + 1),this._playerY );
                    replied = true;
                    break;
            }
        }
        if (!replied){
            switch (answer) {
                case 'n':
                    this.resetPlayer();
                    break;
                case 'm':
                    this.newGame();
                    break;
                case 'q':
                    this._continueGame = false;
                    console.log(this._messages[7]);
                    break;
                case 'i':
                    this.print();
                    console.log(this._messages[0]);
                    if (this._gameRunning){
                        console.log(this._messages[1]);
                    }
                    break;
                default:
                    console.log(this._messages[6]);
                    break;
            }
            replied = true;
        }
    }

    moveCharacter(x, y){
        
        this._field[this._playerY][this._playerX] = this._belowPlayer;
        this._playerX = x;
        this._playerY = y;
        
        //Check for out of bounds
        if (this._playerY >= this._row || this._playerY < 0 || this._playerX >= this._col || this._playerX < 0){
            this._gameRunning = false;
            
            this._currentState = 4;
            this.print();
            console.log(this._messages[5]);
        }

        else{
            this._belowPlayer = this._field[this._playerY][this._playerX];
            this._field[this._playerY][this._playerX] = this._playerCharacter;
            this.print();
            
            if (this._belowPlayer == this._holeCharacter){
                this._gameRunning = false;
                this._currentState = 3;
                this.print();
                console.log(this._messages[5]);
            }
            else if (this._belowPlayer == this._goalCharacter) {
                this._gameRunning = false;
                this._currentState = 2;
                this.print();
                console.log(this._messages[5]);
            }
        }
    }
        
    resetPlayer() {
        this.placePlayer();
        this._gameRunning = true;
        this._currentState = 8;
        this.print();
        console.log(this._messages[0]);
        console.log(this._messages[1]);
    }

    newGame() {
        this.generateField();
        this.placePlayer();
        this._gameRunning = true;
        

        let goalNotPlaced = true;
        let runLimit = 0;
        while (goalNotPlaced){
            let x = 0;
            let y = 5;

            x += Math.floor(Math.random() * 10);
            y += Math.floor(Math.random() * 5);

            if (this._field[y][x] != this._holeCharacter){
                this._field[y][x] = this._goalCharacter;
                goalNotPlaced = false;
            }
            if(runLimit >= 20){goalNotPlaced = false;}
            runLimit++;
        }
        this._gameRunning = true;

        this._currentState = 8;
        this.print();
        console.log(this._messages[0]);
        console.log(this._messages[1]);
    }

    runGame() {
        this.newGame();
        this._continueGame = true;
        while(this._continueGame){
            this.askQuestion();
        }
    }

}

const myGame = new Game(15);
myGame.runGame();
