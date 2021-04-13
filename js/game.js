'use strict';


var gBoard;
var gGame;
var gCurrectSquareIdx;

function init() {
    gGame = {
        isOn: false,
        score: 0,
        secsPassed: 0,
    }
    gCurrectSquareIdx = false;
    gBoard = buildBoard();
    renderBoard(gBoard);
}

function buildBoard() {
    var board = [];
    for (var i = 0; i < 28; i++) {
        board.push([]);
        for (var j = 0; j < 14; j++) {
            board[i][j] = {
                isShown: false,
            };
        }
    }
    return board;
}


function playGame() {
    timer();
    moveSquare(gBoard);
    linesAndPush(gBoard);
    cheakGameOver(gBoard);
}

function timer() {
    var elTimerSpan = document.querySelector(`.time`);
    elTimerSpan.innerHTML = 'Time: ' + (Math.round(gGame.secsPassed += 0.1));
    return;

}

function updateScore() {
    var elScoreSpan = document.querySelector(`.score`);
    elScoreSpan.innerHTML = 'Score: ' + (gGame.score += 100);
    return;

}

function generateRandomSquareIdx() {
    var randomIdx = 0;
    while (randomIdx <= 0 || randomIdx >= 14) {
        randomIdx = getRandomIntInclusive(0, 13)
    }
    gCurrectSquareIdx = {
        idxP1: [0, randomIdx],
        idxP2: [0, randomIdx - 1],
        idxP3: [1, randomIdx],
        idxP4: [1, randomIdx - 1]
    };
    return;

}

function moveSquare(board, eventKey) {

    if (!gGame.isOn) {
        return;
    }
    if (!gCurrectSquareIdx) {
        generateRandomSquareIdx();
    }


    if (eventKey === 'ArrowLeft') {
        if (gCurrectSquareIdx.idxP2[1] === 0 || gCurrectSquareIdx.idxP4[1] === 0) {
            return;
        }
        if (board[gCurrectSquareIdx.idxP2[0]][gCurrectSquareIdx.idxP2[1] - 1].isShown) {
            return;
        }
        for (const property in gCurrectSquareIdx) {
            board[gCurrectSquareIdx[property][0]][gCurrectSquareIdx[property][1]--].isShown = true;
        }
    } else if (eventKey === 'ArrowRight') {
        if (gCurrectSquareIdx.idxP1[1] === 13 || gCurrectSquareIdx.idxP3[1] === 13) {
            return;
        }
        if (board[gCurrectSquareIdx.idxP1[0]][gCurrectSquareIdx.idxP1[1] + 1].isShown) {
            return;
        }
        for (const property in gCurrectSquareIdx) {

            board[gCurrectSquareIdx[property][0]][gCurrectSquareIdx[property][1]++].isShown = true;
        }
    } else {
        for (const property in gCurrectSquareIdx) {
            board[gCurrectSquareIdx[property][0]++][gCurrectSquareIdx[property][1]].isShown = true;
        }
    }

    renderBoard(board);

    if (gCurrectSquareIdx.idxP3[0] === 28) {
        gCurrectSquareIdx = null;

    }

    if (eventKey === 'ArrowRight') {
        for (const property in gCurrectSquareIdx) {
            board[gCurrectSquareIdx[property][0]][gCurrectSquareIdx[property][1] - 1].isShown = false;
        }

    } else if (eventKey === 'ArrowLeft') {
        for (const property in gCurrectSquareIdx) {
            board[gCurrectSquareIdx[property][0]][gCurrectSquareIdx[property][1] + 1].isShown = false;
        }

    } else {
        if (board[gCurrectSquareIdx.idxP3[0]][gCurrectSquareIdx.idxP3[1]].isShown || board[gCurrectSquareIdx.idxP4[0]][gCurrectSquareIdx.idxP4[1]].isShown) {
            gCurrectSquareIdx = null;
        }
        for (const property in gCurrectSquareIdx) {

            board[gCurrectSquareIdx[property][0] - 1][gCurrectSquareIdx[property][1]].isShown = false;
        }
    }

}


function linesAndPush(board) {
    var linesCounts = 14;
    for (var i = 0; i < 28; i++) {
        var isLine = true;
        for (var j = 0; j < 14; j++) {
            if (!board[i][j].isShown) {
                isLine = false;
            }
        }
        while (isLine && linesCounts) {
            board[i][linesCounts - 1].isShown = false;
            linesCounts--;
        }
        if (isLine) {
            updateScore();
        }
    }
}

function handleKey(event) {
    moveSquare(gBoard, event.key);
}


function navKey(key) {
    moveSquare(gBoard, key);

}

function cheakGameOver(board) {
    for (var i = 0; i < board[0].length; i++) {
        if (board[0][i].isShown) {
            clearInterval(gGame.isOn);
            gGame.isOn = false;
            var elButton = document.querySelector(`.play-game`);
            elButton.textContent = `Restart?`
            elButton.style.display = "inline";
        }
    }


}

function startGame() {
    init();
    gGame.isOn = setInterval(playGame, 100);
    var elButton = document.querySelector(`.play-game`);
    elButton.style.display = "none";
}

function renderBoard(board) {
    var strHTML = '<table ><tbody>';
    for (var i = 0; i < 28; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < 14; j++) {
            if (board[i][j].isShown) {
                var shownClassName = 'shown-cell';
            } else {
                var shownClassName = ' ';
            }
            var className = 'cell cell';
            strHTML += '<td class="' + className + ' ' + shownClassName + ' ' + ')"></td>'
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(`.board-container`);

    elContainer.innerHTML = strHTML;
}