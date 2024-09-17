const gameBoard = (function(){
    let board = [];
    let turn = 0;

    for (i=0; i<9; i++){
        board.push("")
    }

   function get(){
        let a = board.slice(0,3);
        let b = board.slice(3,6);
        let c = board.slice(6);
        let d = [board[0], board[3], board[6]];
        let e = [board[1], board[4], board[7]];
        let f = [board[2], board[5], board[8]];
        let g = [board[0], board[4], board[8]];
        let h = [board[2], board[4], board[6]];

        return [a, b, c, d, e, f, g, h]
    }

    let printBoard = function(){
        
        console.log(get()[0]);
        console.log(get()[1]);
        console.log(get()[2]);
        console.log('  1    2    3');
    }

    const play = function(number){
        
        function checkWinner (){
            turn++;
            for (let letter of get()) {
                if (letter[0] != "" && letter[0] === letter[1] && letter[0] === letter[2]){
                    player.scores();
                    gameflow.endGame;
                    reset();
                    get();
                    printBoard();
                    turn = 0;
                    
                }

                else if (turn === 9){
                    console.log("It's a tie!")
                    reset();
                    printBoard();
                    turn = 0;
                }
            }
        }

        if (board[number] === ""){
            board[number] = player.getCurrent().playerMark;

            console.log(`${player.getCurrent().name} played:`)
            printBoard();
            boardToDOM.updateValues(number);
            checkWinner();
            player.next();
            gameflow.nextRound();
            console.log(`${player.getCurrent().name}'s turn.`)
            
        }   
    }

    const reset = function(){
        for (i=0; i<9; i++){
            board[i] = "";
            const cell = document.querySelectorAll(".cell");
            cell.forEach(cell => {
                cell.textContent = ""})
        }
        // boardToDOM.resetValues();
    }

    return {printBoard, play, reset, board}
})();

const player = (function(){
    let players = [
        player1 = {name: "Player 1", playerMark: "X", score: 0},
        player2 = {name: "Player 2", playerMark: "O", score: 0}
    ]

    let currentPlayer = players[0];

    function next(){
        currentPlayer === players[0] ? currentPlayer = players[1] : currentPlayer = players[0]
    }

    const getCurrent = function(){
        return currentPlayer;
    }

    const rename = function(number, name){
        let x = number - 1;
        players[x].name = name;
        console.log('name changed');
    }

    const scores = function(){
        getCurrent().score++
        console.log('player scores')
    }

    const resetScore = function(){
        players[0].score = 0;
        players[1].score = 0;
        console.log('score reset');
    }

    const higherScore = function(){
      higherScore = players[0].score > players[1].score ? players[0].score : players[1].score
        return higherScore;
    }

    return {next, getCurrent, rename, scores, resetScore, higherScore}
})();

const gameflow = (function(){

    let round = 0;
    let maxRound = 5;

    const newGame = function(max){
        player.resetScore();
        gameBoard.reset();
        maxRound = max;
    }

    const nextRound = function(){
        round++
    }

    const endGame = function (){
    
        if (higherScore() > maxRound/2){
            console.log("The game has ended. Play again?")
        }
    }
    
    const getRound = function (){
        return round;
    }

    return {newGame, nextRound, endGame, getRound}
})();

// Above this line are placed the game logic, below its the DOM management

const boardToDOM = (function(){
    
    const board = document.querySelector(".board");

    for (i=0; i<9; i++){
        const cell = document.createElement("div");
        cell.setAttribute("id", `_${i}`)
        cell.classList.add("cell");
        board.appendChild(cell);
    }

    const updateValues = function(id){
        const cell = document.querySelector(`#_${id}`)
        cell.textContent = (gameBoard.board[id]);
    }

    // const resetValues = function(){
    //     for (i=0; i<9; i++){
    //         const cell = document.querySelector(`#_${i}`);
    //         cell.textcontent = ("");
    //     }
    // }

    return {updateValues}
})();


const board = document.querySelector(".board");
board.addEventListener('click', (event) => {
    let cell = event.target;
    switch (cell.id){
        case '_0':
            gameBoard.play(0);
            break;
        
        case '_1':
            gameBoard.play(1);
            break;

        case '_2':
            gameBoard.play(2);
            break
        
        case '_3':
            gameBoard.play(3);
            break

        case '_4':
            gameBoard.play(4);
            break

        case '_5':
            gameBoard.play(5);
            break
        
        case '_6':
            gameBoard.play(6);
            break

        case '_7':
            gameBoard.play(7);
            break

        case '_8':
            gameBoard.play(8)
            break
    }    
})
