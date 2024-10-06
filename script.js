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
            boardToDOM.updateCells(number);
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
        boardToDOM.updateScore();
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
        currentPlayer === players[0] ? currentPlayer = players[1] : currentPlayer = players[0];
        displayNames.current();
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
    let maxRound = 3;

    const newGame = function(){
        player.resetScore();
        gameBoard.reset();
        
    }

    const nextRound = function(){
        round++
        gameBoard.reset();
        gameBoard.printBoard();
    }

    const endGame = function (){
    
        if (player.higherScore() > maxRound/2){
            console.log("The game has ended. Play again?")
            modal.gameEnd();
        } else {
            modal.roundEnd();
        }
    }
    
    const getRound = function (){
        return round;
    }

    return {newGame, nextRound, endGame, getRound}
})();

// Above this line is placed the game logic, below its the DOM management and events handler

const boardToDOM = (function(){
    
    const board = document.querySelector(".board");

    for (let i=0; i<9; i++){
        const cell = document.createElement("div");
        cell.setAttribute("id", `_${i}`)
        cell.classList.add("cell");
        board.appendChild(cell);
    }

    const updateCells = function(id){
        const cell = document.querySelector(`#_${id}`);
        let image = document.createElement("img");
        let string = "./images/"+`${player.getCurrent().playerMark}`+".svg";
        image.setAttribute("src", string);
        image.classList.add(`${player.getCurrent().playerMark}`)
        cell.appendChild(image);}

    const updateScore = function(){
        let score1Display = document.querySelector("#p1score");
        let score2Display = document.querySelector("#p2score");
        score1Display.textContent = (`${player.players[0].score}`);
        score2Display.textContent = (`${player.players[1].score}`);
    }

    return {updateCells, updateScore}
})();


const board = document.querySelector(".board");
board.addEventListener('click', (event) => {
    let cell = event.target;
    let index = cell.id.charAt(1);
    gameBoard.play(index);
})

const displayNames = (function(){
    const displayP1 = document.querySelector(".p1");
    const displayP2 = document.querySelector(".p2");
    
    const names = function(){
        displayP1.textContent = (`${player.players[0].name}`);
        displayP2.textContent = (`${player.players[1].name}`);}

    const current = function (){
        const whoPlays = document.querySelector(".currentPlayer");
        whoPlays.textContent=(`${player.getCurrent().name}'s turn.`)}

    names();
    current();

    return {current, names}
})();

const pageButtons = (function(){
const renameButton = document.querySelector(".rename");
    renameButton.addEventListener('click', ()=>{
    modal.rename()});

const restartButton = document.querySelector(".restart");
    restartButton.addEventListener('click', ()=>{
        gameflow.newGame();
    })})();

const modal = (function(){
    let modals = document.querySelector('dialog');

    const roundEnd = function(){
        let closeButton = document.createElement("div");
        closeButton.textContent = ('x');
        closeButton.classList.add('closeButton');

        modals.textContent = (`${player.getCurrent().name} wins the round!`);
        modals.appendChild(closeButton);
   
        closeButton.addEventListener('click', ()=>{
        modals.close();
        modals.innerHTML = '';
        })
        modals.addEventListener('close',()=>{    
        gameflow.nextRound();
        modals.innerHTML = '';
        })

        modals.showModal();
    }

    const gameEnd = function(){
        modals.textContent = (`${player.getCurrent().name} won! Play again?`);
        let yes = document.createElement("p");
        yes.textContent = ('Yes');
        modals.appendChild(yes);
        let no = document.createElement("p");
        no.textContent = ('No');
        modals.appendChild(no);

        yes.addEventListener('click',()=>{
            gameflow.newGame();
            modals.close();
        })
        no.addEventListener('click',()=>{
            modals.close();
        })
        modals.showModal();
    }

    const rename = function(){
       
        let name1 = document.createElement("input");
        name1.setAttribute('id', 'name1');
        let name2 = document.createElement("input");
        name2.setAttribute('id', 'name2');
        let name1label = document.createElement("label");
        let name2label = document.createElement("label");
        name1label.setAttribute('for', 'name1');
        name1label.textContent = ('Player 1');
        name2label.textContent = ('Player 2');
        let skip = document.createElement("br");
        let skip2 = document.createElement("br");

        modals.appendChild(name1label);
        modals.appendChild(name1);
        modals.appendChild(skip);
        modals.appendChild(name2label);
        modals.appendChild(name2);
        modals.appendChild(skip2);
        let apply = document.createElement("button");
        apply.textContent=('Apply')
        let cancel = document.createElement("button");
        cancel.textContent=('Cancel')
        modals.appendChild(apply);
        modals.appendChild(cancel);

        apply.addEventListener('click',()=>{
            if (name1.value != ""){
                player.rename(1, name1.value)
            }
            
            if (name2.value != ""){
                player.rename(2, name2.value)
            }

            displayNames.names();
            modals.close();
            modals.innerHTML = '';
        })

        cancel.addEventListener('click',()=>{
            modals.close();
            modals.innerHTML = '';
        })

        modals.addEventListener('close',()=>{    
            modals.innerHTML = '';
            })

        modals.showModal();
    }

    return {roundEnd, gameEnd, rename}
})();