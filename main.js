import { createMatrix, createPiece, rotate } from './utils.js';
import { collide, merge, arenaSweep } from './mechanics.js';

const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
context.scale(20, 20);

const nextCanvas = document.getElementById('next');
const nextContext = nextCanvas.getContext('2d');
nextContext.scale(20, 20);

const colors = [
  null,
  '#FF0D72', '#0DC2FF', '#0DFF72',
  '#F538FF', '#FF8E0D', '#FFE138', '#3877FF'
];

const arena = createMatrix(12, 20);

const player = {
  pos: { x: 0, y: 0 },
  matrix: null,
  next: null,
  score: 0,
  lines: 0,
  level: 0,
  dropInterval: 1000
};

window.gameActive = false;

window.startGame = function() {
  window.gameActive = true;
  playerReset();
  update(0);
};

window.resetGame = function() {
  arena.forEach(row => row.fill(0));
  player.score = 0;
  player.lines = 0;
  player.level = 0;
  player.dropInterval = 1000;
  updateScore();
  window.gameActive = true;
  playerReset();
};

function updateScore() {
  document.getElementById('score').innerText = player.score;
  document.getElementById('level').innerText = player.level;
  document.getElementById('lines').innerText = player.lines;
}

function drawMatrix(matrix, offset, ctx) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        ctx.fillStyle = colors[value];
        ctx.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
}

function draw() {
  context.fillStyle = '#000';
  context.fillRect(0, 0, canvas.width, canvas.height);
  drawMatrix(arena, { x: 0, y: 0 }, context);
  drawMatrix(player.matrix, player.pos, context);

  nextContext.fillStyle = '#000';
  nextContext.fillRect(0, 0, nextCanvas.width, nextCanvas.height);
  drawMatrix(player.next, { x: 1, y: 1 }, nextContext);
}

function playerReset() {
  if (!player.next) {
    const pieces = 'TJLOSZI';
    player.next = createPiece(pieces[Math.floor(Math.random() * pieces.length)]);
  }
  player.matrix = player.next;
  const pieces = 'TJLOSZI';
  player.next = createPiece(pieces[Math.floor(Math.random() * pieces.length)]);

  player.pos.y = 0;
  player.pos.x = Math.floor(arena[0].length / 2) - Math.floor(player.matrix[0].length / 2);

  if (collide(arena, player)) {
    if (gameActive) {
      gameActive = false;
      window.showGameOver(player.level, player.score, player.lines);
    } else {
      arena.forEach(row => row.fill(0));
      player.score = 0;
      player.lines = 0;
      player.level = 0;
      player.dropInterval = 1000;
      updateScore();
    }
  }
  updateScore();
}

function playerMove(dir) {
  player.pos.x += dir;
  if (collide(arena, player)) {
    player.pos.x -= dir;
  }
}

function playerDrop() {
  player.pos.y++;
  if (collide(arena, player)) {
    player.pos.y--;
    merge(arena, player);
    playerReset();
    arenaSweep(arena, player);
    updateScore();
  }
  dropCounter = 0;
}

function playerRotate(dir) {
  const pos = player.pos.x;
  let offset = 1;
  rotate(player.matrix, dir);
  while (collide(arena, player)) {
    player.pos.x += offset;
    offset = -(offset + (offset > 0 ? 1 : -1));
    if (offset > player.matrix[0].length) {
      rotate(player.matrix, -dir);
      player.pos.x = pos;
      return;
    }
  }
}

function playerHardDrop() {
  while (!collide(arena, { 
    matrix: player.matrix, 
    pos: { x: player.pos.x, y: player.pos.y + 1 } 
  })) {
    player.pos.y++;
  }
  playerDrop();
}

let dropCounter = 0;
let lastTime = 0;

function update(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;
  
  if (gameActive) {
    dropCounter += deltaTime;
    if (dropCounter > player.dropInterval) {
      playerDrop();
    }
  }
  
  draw();
  requestAnimationFrame(update);
}

document.addEventListener('keydown', event => {
  if (['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', 'q', 'w'].includes(event.key)) {
    event.preventDefault();
  }
  
  if (event.key === 'ArrowLeft') playerMove(-1);
  else if (event.key === 'ArrowRight') playerMove(1);
  else if (event.key === 'ArrowDown') playerDrop();
  else if (event.key === 'ArrowUp') playerHardDrop();
  else if (event.key === 'q') playerRotate(-1);
  else if (event.key === 'w') playerRotate(1);
});

// playerReset();
// update();