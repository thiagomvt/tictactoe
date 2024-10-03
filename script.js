const gameBoard = (function(){
    let board = [];
    let turn = 0;

    for (let i=0; i<9; i++){
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
                    boardToDOM.updateScore();
                    gameflow.endGame();
                    modal().showModal();
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
            console.log(`${player.getCurrent().name}'s turn.`)
            
        }   
    }

    const reset = function(){
        for (let i=0; i<9; i++){
            board[i] = "";
            const cell = document.querySelectorAll(".cell");
            cell.forEach(cell => {
                while (cell.firstChild)
                cell.removeChild(cell.firstChild)})
        }
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
      displayHigherScore = players[0].score > players[1].score ? players[0].score : players[1].score
        return displayHigherScore;
    }

    return {next, getCurrent, rename, scores, resetScore, higherScore, players}
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
        gameBoard.reset();
        gameBoard.printBoard();
    }

    const endGame = function (){
    
        if (player.higherScore() > maxRound/2){
            console.log("The game has ended. Play again?")
        }
    }
    
    const getRound = function (){
        return round;
    }

    return {newGame, nextRound, endGame, getRound}
})();

// Above this line is placed the game logic, below its the DOM management

const boardToDOM = (function(){
    
    const board = document.querySelector(".board");

    for (let i=0; i<9; i++){
        const cell = document.createElement("div");
        cell.setAttribute("id", `_${i}`)
        cell.classList.add("cell");
        board.appendChild(cell);
    }

    const updateValues = function(id){
        const cell = document.querySelector(`#_${id}`);
        // cell.textContent = (gameBoard.board[id]);
        let image = document.createElement("img");
        let string = "./images/"+`${player.getCurrent().playerMark}`+".svg";
        image.setAttribute("src", string);
        image.classList.add(`${player.getCurrent().playerMark}`)
        cell.appendChild(image);
        
        const displayP1 = document.querySelector(".p1");
        const displayP2 = document.querySelector(".p2");
      
        displayP1.textContent = (`${player.players[0].name}`);
        displayP2.textContent = (`${player.players[1].name}`);

        const displayCurrentPlayer = document.querySelector("p");
        displayCurrentPlayer.textContent = (`${player.getCurrent().name}`)
    };

    const updateScore = function(){
        let score1Display = document.querySelector("#p1score");
        let score2Display = document.querySelector("#p2score");
        score1Display.textContent = (`${player.players[0].score}`);
        score2Display.textContent = (`${player.players[1].score}`);

    }

    return {updateValues, updateScore}
})();


const board = document.querySelector(".board");
board.addEventListener('click', (event) => {
    let cell = event.target;
    let index = cell.id.charAt(1);
    gameBoard.play(index);
})

const displayP1 = document.querySelector(".p1");
const displayP2 = document.querySelector(".p2");
  
displayP1.textContent = (`${player.players[0].name}`);
displayP2.textContent = (`${player.players[1].name}`);

// const renameButton = document.querySelector(".renameButton");
// renameButton.addEventListener('click', ()=>{
//     if (displayP1.value != ""){
//     player.rename(1, displayP1.value)};

//     if (displayP2.value != ""){
//     player.rename(2, displayP2.value)};
// })

const modal = function(){
    let modals = document.querySelector('.roundResult');
    let closeButton = document.createElement("div");
    closeButton.textContent = ('x');
    closeButton.classList.add('closeButton');
    modals.textContent = (`${player.getCurrent().name} wins the round!`);
    modals.appendChild(closeButton);
    closeButton.addEventListener('click', ()=>{
        modals.close();
    })
    modals.addEventListener('close',()=>{
        gameflow.nextRound();
    })

    return modals}