export function collide(arena, player) {
  const [m, o] = [player.matrix, player.pos];
  for (let y = 0; y < m.length; ++y) {
    for (let x = 0; x < m[y].length; ++x) {
      if (m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
        return true;
      }
    }
  }
  return false;
}

export function merge(arena, player) {
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        arena[y + player.pos.y][x + player.pos.x] = value;
      }
    });
  });
}

export function arenaSweep(arena, player) {
  let rowCount = 1;
  let linesCleared = 0;
  outer: for (let y = arena.length - 1; y >= 0; --y) {
    for (let x = 0; x < arena[y].length; ++x) {
      if (arena[y][x] === 0) continue outer;
    }
    const row = arena.splice(y, 1)[0].fill(0);
    arena.unshift(row);
    ++y;
    linesCleared++;
  }
  if (linesCleared > 0) {
    player.score += [0, 40, 100, 300, 1200][linesCleared] * (player.level + 1);
    player.lines += linesCleared;
    if (player.lines >= (player.level + 1) * 10) {
      player.level++;
      player.dropInterval = Math.max(100, 1000 - player.level * 100);
    }
  }
}