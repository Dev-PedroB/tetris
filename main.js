import { createMatrix, createPiece, rotate } from './utils.js';
import { collide, merge, arenaSweep } from './mechanics.js';

const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
context.scale(20, 20);

const colors = [
  null,
  '#FF0D72', '#0DC2FF', '#0DFF72',
  '#F538FF', '#FF8E0D', '#FFE138', '#3877FF'
];

const arena = createMatrix(12, 20);

const player = {
  pos: { x: 0, y: 0 },
  matrix: null
};

function drawMatrix(matrix, offset) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        context.fillStyle = colors[value];
        context.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
}

function draw() {
  context.fillStyle = '#000';
  context.fillRect(0, 0, canvas.width, canvas.height);
  drawMatrix(arena, { x: 0, y: 0 });
  drawMatrix(player.matrix, player.pos);
}

function playerReset() {
  const pieces = 'TJLOSZI';
  player.matrix = createPiece(pieces[Math.floor(Math.random() * pieces.length)]);
  player.pos.y = 0;
  player.pos.x = Math.floor(arena[0].length / 2) - Math.floor(player.matrix[0].length / 2);
  if (collide(arena, player)) {
    arena.forEach(row => row.fill(0));
  }
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
    arenaSweep(arena);
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

let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;

function update(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;
  dropCounter += deltaTime;
  if (dropCounter > dropInterval) {
    playerDrop();
  }
  draw();
  requestAnimationFrame(update);
}

document.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') playerMove(-1);
  else if (event.key === 'ArrowRight') playerMove(1);
  else if (event.key === 'ArrowDown') playerDrop();
  else if (event.key === 'q') playerRotate(-1);
  else if (event.key === 'w') playerRotate(1);
});

playerReset();
update();
