// game displays rows and columns of circles
// player is notified of whose turn it is
// player clicks a button to make a move
// the player's move is displayed on the board
// the turn switches from p1 to p2
// p2 can select a move with the same process
// at the end of a game, announce the winner
// allow the opportunity to play again

//////////////////////////////////
// constants
//////////////////////////////////
// this section is going to hold things like players, colors, and anything that might be useful to refer to but doesn't change over the course of gameplay.
// the only constant we're going to use here are the colors, stored in an object for the sake of easy reference.
// so, player 1 has one color, player 2 a different color, or we'll initialize the game board pieces with a 'blank' color
const colors = {
    0: 'white',
    1: 'purple',
    // if we want to use a negative number for a key
    // we can use a string
    '-1': 'orange'
}

//////////////////////////////////
// state variables
//////////////////////////////////
// things that we want to constantly check, refer to, and change.
// these will allow us to properly render changes at the right time.
let board // an array of 7 nested arrays
let turn // will be a value of 1 or -1 (1 || -1)
let winner // null || 1 || -1 || 'T'

//////////////////////////////////
// cached DOM elements
//////////////////////////////////
// grab our HTML elements, save them to variables, and use later
const messageEl = document.querySelector('h2')
const playAgainButton = document.querySelector('button')
// we want to grab our marker elements and save them to an array
// NOT A NODELIST
// ... = spread operator
// this operator takes a copy of whatever is selected(object, a nodelist, htmlcollection, array) and does something to all of the items
// because we used array brackets, the spread operator is grabbing the items in the nodelist and pushing them into a new array
const markerEls = [...document.querySelectorAll('#markers > div')]
console.log('markerEls \n', markerEls)

//////////////////////////////////
// functions
//////////////////////////////////

// function - init - initializes an empty game.
// the init function runs one time when the page loads
// then the init function will be called again from the play again button

function init() {
    // set values for our state variables
    turn = 1
    winner = null

    board = [
        [0, 0, 0, 0, 0, 0], // col 0
        [0, 0, 0, 0, 0, 0], // col 1
        [0, 0, 0, 0, 0, 0], // col 2
        [0, 0, 0, 0, 0, 0], // col 3
        [0, 0, 0, 0, 0, 0], // col 4
        [0, 0, 0, 0, 0, 0], // col 5
        [0, 0, 0, 0, 0, 0], // col 6
    ]

    // CALL THE RENDER FUNCTION ONCE THE RENDER FUNCTION IS BUILT
    render()
}

init()

// function - renderBoard - render the game board
function renderBoard() {
    // loop over our array that represents the board
    // apply a background color for each element
    board.forEach((colArr, colIdx) => {
        // colArr is the column, colIdx is the id within the array
        // console.log('colArr', colArr)
        // console.log('colIdx', colIdx)
        colArr.forEach((cellVal, rowIdx) => {
            // console.log('cellVal', cellVal)
            // console.log('rowIdx', rowIdx)
            // determine the id of the element
            const cellId = `c${colIdx}r${rowIdx}`
            // I could have done this, but it's a lil clunky and old school
            // const cellId2 = 'c' + colIdx + 'r' + rowIdx
            // console.log('cellId', cellId)

            const cellEl = document.getElementById(cellId)
            // console.log('cellEl', cellEl)

            cellEl.style.backgroundColor = colors[cellVal]
            
        })
    })
}

// render controls -> changes the visibility of the play again button
function renderControls() {
    // change initial vis of the playAgain button
    // this uses a ternary operator
    // ask a question ? if true, do this : if false do that
    playAgainButton.style.visibility = winner ? 'visible' : 'hidden'
    // change vis of our marker buttons
    markerEls.forEach((markerEl, colIdx) => {
        // if all board spaces are full (no 0's left) (means a tie)
        // OR if we have a winner (winner is a truthy value (not null))
        const hideMarker = !board[colIdx].includes(0) || winner
        // if either of those conditions is truthy, hide the markers
        // otherwise play can continue
        markerEl.style.visibility = hideMarker ? 'hidden' : 'visible'
    })
}

// render message -> display whose turn it is
function renderMessage() {
    // message a tie
    if (winner === 'T') {
        messageEl.innerText = "It's a Tie!!!!"
    // message a winner
    } else if (winner) {
        messageEl.innerHTML = `
            <span style="color: ${colors[winner]}">
                ${colors[winner].toUpperCase()}
            </span> Wins!
        `
    // or the current turn
    } else {
        messageEl.innerHTML = `
            <span style="color: ${colors[turn]}">
                ${colors[turn].toUpperCase()}
            </span>'s Turn!
        `
    }
}

// render -> call all of our render based functions at once
function render() {
    // call renderBoard
    renderBoard()
    // call renderMessage
    renderMessage()
    // call renderControls
    renderControls()
}

// handleDrop -> this will be the main gameplay function, finds the marker that was clicked on, and drops to the bottommost position allowed
function handleDrop(event) {
    // check if a move is valid
    // determine the column selected
    const colIdx = markerEls.indexOf(event.target)
    console.log('this is colIdx inside handleDrop', colIdx)
    // assign a value to a specific cell (board element) by updating the board array
    const colArr = board[colIdx]
    console.log('this is colArr inside handleDrop', colArr)
    // we want to select the first row cell that we find in the colArr
    // this gets the first item that contains a zero
    // returns the item if true, -1 if false
    const rowIdx = colArr.indexOf(0)
    // if the move is invalid, exit the function so the user can try again
    if (rowIdx === -1) return
    // if the move IS valid, update the value of the board array
    // we'll assign the value to the cell based on the turn
    colArr[rowIdx] = turn
    // after everything is done, change whose turn it is
    turn *= -1
    // after every move, we want to check for a winner
    // we're going to assign the winning value to the winner variable
    winner = getWinner(colIdx, rowIdx)
    // after every move, we want to render the changes
    render()
    // console.log('this is the current board', board)
}


// we might need multiple functions to achieve this
// helper function for our winchecking functions
function countAdjacent(colIdx, rowIdx, colOffset, rowOffset) {
    // get the most recently played color
    const player = board[colIdx][rowIdx]
    // count how many matches are adjacent
    let count = 0

    // use a while loop to check the spaces around the most recently played spot
    colIdx += colOffset
    rowIdx += rowOffset

    while (
        board[colIdx] !== undefined && 
        board[colIdx][rowIdx] !== undefined && 
        board[colIdx][rowIdx] === player
    ) {
        count++
        colIdx += colOffset
        rowIdx += rowOffset
    }
    console.log('the count in countAdjacent', count)

    return count
}
// checkHorizontalWin
function checkHorizontalWin(colIdx, rowIdx) {
    // going to the left
    const adjCountLeft = countAdjacent(colIdx, rowIdx, -1, 0)
    // going to the right
    const adjCountRight = countAdjacent(colIdx, rowIdx, 1, 0)

    return adjCountLeft + adjCountRight >= 3 ? board[colIdx][rowIdx] : null
}
// checkVerticalWin
function checkVerticalWinner(colIdx, rowIdx) {
    // go from N to S
    // 0 = not changing column
    // -1 moves south down the column
    return countAdjacent(colIdx, rowIdx, 0, -1) === 3 ? board[colIdx][rowIdx] : null
}
// checkDiagonalSENWWin
function checkDiagonalSENWWin(colIdx, rowIdx) {
    // go NW
    const adjCountNW = countAdjacent(colIdx, rowIdx, -1, 1)
    // go SE
    const adjCountSE = countAdjacent(colIdx, rowIdx, 1, -1)

    return adjCountNW + adjCountSE >= 3 ? board[colIdx][rowIdx] : null
}
// checkDiagonalSWNEWin
function checkDiagonalSWNEWin(colIdx, rowIdx) {
    // go NE
    const adjCountNE = countAdjacent(colIdx, rowIdx, 1, 1)
    // go SW
    const adjCountSW = countAdjacent(colIdx, rowIdx, -1, -1)

    return adjCountNE + adjCountSW >= 3 ? board[colIdx][rowIdx] : null
}
// getWinner -> checks to see if a player has won the game
function getWinner(colIdx, rowIdx) {
    console.log('this is colIdx - getWinner', colIdx)
    console.log('this is rowIdx - getWinner', rowIdx)
    console.log('the board', board)
    return(
        checkHorizontalWin(colIdx, rowIdx) ||
        checkVerticalWinner(colIdx, rowIdx) ||
        checkDiagonalSENWWin(colIdx, rowIdx) ||
        checkDiagonalSWNEWin(colIdx, rowIdx)
    )
}

//////////////////////////////////
// event listeners
//////////////////////////////////
// what events will happen, what they should be attached to, and what functions they call
// click on a marker (to make a move)
document.getElementById('markers').addEventListener('click', handleDrop)
// click play again (initialize an empty board) (reset all variables)
playAgainButton.addEventListener('click', init)