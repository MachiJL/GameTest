const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gravity = 0.8;
let score = 0;
let gameOver = false;

const player = {
    x: 50,
    y: 300,
    width: 40,
    height: 50,
    dy: 0,
    jumping: false
};

let obstacles = [];

function jump() {
    if (!player.jumping) {
        player.dy = -14;
        player.jumping = true;
    }
}

document.addEventListener("keydown", e => {
    if (e.code === "Space") {
        if (gameOver) restartGame();
        else jump();
    }
});

function spawnObstacle() {
    obstacles.push({
        x: canvas.width,
        y: 320,
        width: 30,
        height: 50
    });
}

setInterval(() => {
    if (!gameOver) spawnObstacle();
}, 1500);

function update() {
    if (gameOver) return;

    player.dy += gravity;
    player.y += player.dy;

    if (player.y >= 300) {
        player.y = 300;
        player.dy = 0;
        player.jumping = false;
    }

    obstacles.forEach(obs => {
        obs.x -= 6;

        if (
            player.x < obs.x + obs.width &&
            player.x + player.width > obs.x &&
            player.y < obs.y + obs.height &&
            player.y + player.height > obs.y
        ) {
            gameOver = true;
        }
    });

    obstacles = obstacles.filter(obs => obs.x > -50);

    score++;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Ground
    ctx.fillStyle = "green";
    ctx.fillRect(0, 350, canvas.width, 50);

    // Player
    ctx.fillStyle = "orange";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Obstacles
    ctx.fillStyle = "red";
    obstacles.forEach(obs => {
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    });

    // Score
    ctx.fillStyle = "black";
    ctx.font = "24px Arial";
    ctx.fillText("Score: " + score, 20, 30);

    if (gameOver) {
        ctx.font = "40px Arial";
        ctx.fillText("Game Over", 320, 180);
        ctx.font = "20px Arial";
        ctx.fillText("Press SPACE to Restart", 320, 220);
    }
}

function restartGame() {
    score = 0;
    obstacles = [];
    gameOver = false;
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();