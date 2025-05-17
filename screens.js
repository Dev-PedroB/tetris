document.addEventListener('DOMContentLoaded', function() {
  const startScreen = document.getElementById('start-screen');
  const gameOverScreen = document.getElementById('game-over-screen');
  const startButton = document.getElementById('start-button');
  const restartButton = document.getElementById('restart-button');
  const container = document.querySelector('.container');
  
  if (container) {
    container.style.display = 'none';
  }
  
  if (startScreen) {
    startScreen.style.display = 'flex';
  }
  
  if (gameOverScreen) {
    gameOverScreen.style.display = 'none';
  }
  
  if (startButton) {
    startButton.addEventListener('click', function() {
      startScreen.style.display = 'none';
      
      container.style.display = 'flex';
      
      if (typeof window.startGame === 'function') {
        window.startGame();
      } else {
        console.error("Função startGame não encontrada");
      }
    });
  }
  
  if (restartButton) {
    restartButton.addEventListener('click', function() {
      gameOverScreen.style.display = 'none';
      
      if (typeof window.resetGame === 'function') {
        window.resetGame();
      } else {
        console.error("Função resetGame não encontrada");
      }
    });
  }
  
  window.showGameOver = function(level, score, lines) {
    document.getElementById('final-level').textContent = level;
    document.getElementById('final-score').textContent = score;
    document.getElementById('final-lines').textContent = lines;
    
    gameOverScreen.style.display = 'flex';
  };
});