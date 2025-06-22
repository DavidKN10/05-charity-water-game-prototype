// Log a message to the console to ensure the script is linked correctly
console.log('JavaScript file is linked correctly.');

const grid = document.getElementById("grid");
const timer = document.getElementById("timer");

// draw level here
const level1 = [
    ["source", "pipe-l-tr", "empty", "empty", "empty"],
    ["home", "pipe-c", "pipe-l-br", "home", "pipe-l-br"],
    ["empty", "pipe-s-v", "pipe-l-tr", "pipe-s-h", "pipe-l-tr"],
    ["home", "pipe-c", "pipe-s-h", "home", "empty"],
    ["empty", "home", "empty", "empty", "empty"]
];

const tiles = level1;

const winningCombination = [
    ["source", "pipe-l-bl", "empty", "empty", "empty"],
    ["home", "pipe-c", "pipe-l-bl", "home", "pipe-l-bl"],
    ["empty", "pipe-s-v", "pipe-l-tr", "pipe-s-h", "pipe-l-tl"],
    ["home", "pipe-c", "pipe-s-h", "home", "empty"],
    ["empty", "home", "empty", "empty", "empty"]
];

const images = {
    "source": "img/game_assets/water_source.png",
    "home": "img/game_assets/home.png",
    "pipe-l-bl": "img/game_assets/bl_l_pipe.png",
    "pipe-l-br": "img/game_assets/br_l_pipe.png",
    "pipe-l-tl": "img/game_assets/tl_l_pipe.png",
    "pipe-l-tr": "img/game_assets/tr_l_pipe.png",
    "pipe-t-lrb": "img/game_assets/lrb_t_pipe.png",
    "pipe-t-lrt": "img/game_assets/lrt_t_pipe.png",
    "pipe-t-ltb": "img/game_assets/ltb_t_pipe.png",
    "pipe-t-rtb": "img/game_assets/rtb_t_pipe.png",
    "pipe-s-v": "img/game_assets/straight_v_pipe.png",
    "pipe-s-h": "img/game_assets/straight_h_pipe.png",
    "pipe-c": "img/game_assets/cross_pipe.png",
    "empty": ""
};

let startTime = Date.now();
function updateTimer() {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    timer.textContent = `Time: ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}
let currenTime = setInterval(updateTimer, 1000);

function createGrid() {
    grid.innerHTML = "";
    for (let y = 0; y < tiles.length; y++) {
        for (let x = 0; x < tiles[y].length; x++) {
            const tile = document.createElement("div");
            tile.className = "tile";
            tile.dataset.x = x;
            tile.dataset.y = y;
            
            const type = tiles[y][x];
            const imgPath = images[type];
            if (imgPath) {
                const img = document.createElement("img");
                img.src = imgPath;
                tile.appendChild(img);
            }

            tile.onclick = () => rotateTile(x, y);

            grid.appendChild(tile); 
        }
    } 
}

function rotateTile(row, col) {
    // Rotate the tile at (row, col)
    const val = tiles[col][row];
    // basic rotation logic
    const straightPipe = ["pipe-s-v","pipe-s-h"];
    const LPipe = ["pipe-l-bl", "pipe-l-tl", "pipe-l-tr", "pipe-l-br"];
    const TPipe = ["pipe-t-lrb", "pipe-t-ltb", "pipe-t-lrt", "pipe-t-rtb"];
    if (val.startsWith("pipe-l")) {
        const next = LPipe[(LPipe.indexOf(val) + 1) % LPipe.length];
        tiles[col][row] = next;
        createGrid(); 
    }
    else if (val.startsWith("pipe-t")) {
        const next = TPipe[(TPipe.indexOf(val) + 1) % TPipe.length];
        tiles[col][row] = next;
        createGrid();  
    }
    else if (val.startsWith("pipe-s")) {
        const next = straightPipe[(straightPipe.indexOf(val) +1) % straightPipe.length];
        tiles[col][row] = next;
        createGrid(); 
    } 

    // After rotating, check if the player has won
    if (checkWinCondition(tiles)) {
        // Stop the timer if the player has won
        clearInterval(currenTime);
        showWinMessage();
    }
}

function showWinMessage() {
    // Show the win message by setting display to block
    const winMessage = document.getElementById("win-message");
    if (winMessage) {
        winMessage.style.display = "block";
    }

    // Add event listener to the restart button
    const restartBtn = document.getElementById("restart-btn");
    if (restartBtn) {
        restartBtn.onclick = restartGame;
    }
}

// Function to restart the game
function restartGame() {
    // Hide the win message
    const winMessage = document.getElementById("win-message");
    if (winMessage) {
        winMessage.style.display = "none";
    }

    // Reset the tiles to the starting state
    for (let y = 0; y < tiles.length; y++) {
        for (let x = 0; x < tiles[y].length; x++) {
            tiles[y][x] = [
                "source", "pipe-l-tr", "empty", "empty", "empty",
                "home", "pipe-c", "pipe-l-br", "home", "pipe-l-br",
                "empty", "pipe-s-v", "pipe-l-tr", "pipe-s-h", "pipe-l-tr",
                "home", "pipe-c", "pipe-s-h", "home", "empty",
                "empty", "home", "empty", "empty", "empty"
            ][y * tiles[y].length + x];
        }
    }

    // Reset the timer
    startTime = Date.now();
    updateTimer();
    clearInterval(currenTime);
    currenTime = setInterval(updateTimer, 1000);

    // Redraw the grid
    createGrid();
}

function checkWinCondition(currentTiles) {
    if (currentTiles.length !== winningCombination.length) {
        return false;
    }

    for (let x = 0; x < currentTiles.length; x++) {
        if (!Array.isArray(currentTiles[x]) || !Array.isArray(winningCombination[x])) {
            return false;
        }
        if (currentTiles[x].length !== winningCombination[x].length) {
            return false;
        }

        for (let y = 0; y < currentTiles[x].length; y++) {
            if (currentTiles[x][y] !== winningCombination[x][y]) {
                return false;
            }
        }
    }
    return true;
}


createGrid();