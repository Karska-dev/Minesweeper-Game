// This version of Minesweeper game was made exactly by tutorial of Ania Kubów from youtube
const grid = document.querySelector('.grid')
const status = document.querySelector('#status')
const flagsLeft = document.querySelector('#flags-left')
let width = 10
let bombAmount = 20
let flags = 0
let squares = []
let isGameOver = false
flagsLeft.innerHTML = bombAmount - flags

function createBoard() {
    // get shuffled game array with random bombs
    const bombsArray = Array(bombAmount).fill('bomb')
    const emptyArray = Array(width * width - bombAmount).fill('valid')
    const gameArray = emptyArray.concat(bombsArray)
    const shuffledArray = gameArray.sort(() => Math.random() - 0.5)

    for (let i = 0; i < width * width; i++) {
        const square = document.createElement('div')
        square.setAttribute('id', i)
        square.classList.add('cell')
        square.classList.add(shuffledArray[i])
        grid.appendChild(square)
        squares.push(square)

        // normal click
        square.addEventListener('click', function (e) {
            e.preventDefault();
            click(square);
            e.stopPropagation();
            return false;
        }, false)

        // control and left click
        square.oncontextmenu = function(e) {
            e.preventDefault()
            addFlag(square)
        }

        square.addEventListener('touchend', function (e) {
            
            addFlag(square);
            e.preventDefault();
            e.stopPropagation();
            return false;
        }, false)
    }

    // add numbers
    for (let i = 0; i < squares.length; i++) {
        let total = 0
        const isLeftEdge = (i % width === 0)
        const isRightEdge = (i % width === width - 1)

        if (squares[i].classList.contains('valid')) {
            // check left bomb
            if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb')) total++
            // check up-left bomb
            if (i > 9 && !isLeftEdge && squares[i - 1 - width].classList.contains('bomb')) total++
            // check up bomb
            if (i > 9 && squares[i - width].classList.contains('bomb')) total++
            // check up-right bomb
            if (i > 9 && !isRightEdge && squares[i + 1 - width].classList.contains('bomb')) total++
            // check right
            if (!isRightEdge && squares[i + 1].classList.contains('bomb')) total++
            // check down-right bomb
            if (i < 89 && !isRightEdge && squares[i + 1 + width].classList.contains('bomb')) total++
            // check down bomb
            if (i < 90 && squares[i + width].classList.contains('bomb')) total++
            // check down-left bomb
            if (i < 90 && !isLeftEdge && squares[i - 1 + width].classList.contains('bomb')) total++
            squares[i].setAttribute('data', total)
        }
    }
}

createBoard()

// add Flag with the right click
function addFlag(square) {
    if (isGameOver) return
    if (!square.classList.contains('checked') && (flags <= bombAmount)) {
        if (!square.classList.contains('flag') && (flags < bombAmount)) {
            square.classList.add('flag')
            square.innerHTML='🚩'
            flags++
            flagsLeft.innerHTML = bombAmount - flags
            checkForWin()
        } else if (square.classList.contains('flag')){
            square.classList.remove('flag')
            square.innerHTML=''
            flags--
            flagsLeft.innerHTML = bombAmount - flags
        }
    }
}

// click on square action
function click(square) {
    let currentId = square.id
    if (isGameOver) return
    if (square.classList.contains('checked') || square.classList.contains('flag')) return
    if (square.classList.contains('bomb')) {
        gameOver(square)
    } else {
        let total = square.getAttribute('data')
        if (total != 0) {
            square.classList.add('checked')
            square.innerHTML = total
            return
        }
        checkSquare(square, currentId)
    }
    square.classList.add('checked')
}

// check neighboring squares once square is clicked
function checkSquare(square, currentId) {
    const isLeftEdge = (currentId % width === 0)
    const isRightEdge = (currentId % width === width - 1)
    
    setTimeout(() => {
        // recursively click left cell
        if (currentId > 0 && !isLeftEdge) {
            const newId = squares[parseInt(currentId - 1)].id
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
        // recurcively click up-right cell
        if (currentId > 9 && !isRightEdge) {
            const newId =squares[parseInt(currentId) + 1 - width].id
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
        // all top cells 
        if (currentId > 9) {
            const newId =squares[parseInt(currentId) - width].id
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
        // all up-left cells
        if (currentId > 10 && !isLeftEdge) {
            const newId = squares[parseInt(currentId) - 1 - width].id
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
        // all right cells
        if (currentId < 99 && !isRightEdge) {
            const newId =squares[parseInt(currentId) + 1].id
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
        // all down left
        if (currentId < 90 && !isLeftEdge) {
            const newId = squares[parseInt(currentId) - 1 + width].id
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
        // all down right
        if (currentId < 89 && !isRightEdge) {
            const newId = squares[parseInt(currentId) + 1 + width].id
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
        // all down cells
        if (currentId < 90) {
            const newId =squares[parseInt(currentId) + width].id
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
    }, 10)
}

function gameOver(square) {
    status.innerHTML = 'BOOM!💣 Game Over!'
    status.style.visibility = 'visible';
    isGameOver = true;

    // show ALL the bombs
    squares.forEach(square => {
        if (square.classList.contains('bomb')) {
            square.innerHTML = '💣'
        }
    })
}

// check for win
function checkForWin() {
    let matches = 0
    for (let i = 0; i < squares.length; i++) {
        if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
            matches++
        }
        if (matches === bombAmount) {
            status.innerHTML = 'You Win!'
            status.style.visibility = 'visible';
            isGameOver = true
        }
    }
}