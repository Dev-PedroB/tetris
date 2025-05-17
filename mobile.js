document.addEventListener('DOMContentLoaded', function() {
  setupMobileControls();
  adjustMobileLayout();
  preventScrolling();
});

function setupMobileControls() {
  const gameElement = document.querySelector('.container');
  if (!gameElement) return;
  
  const touchControls = document.createElement('div');
  touchControls.className = 'touch-controls';
  
  touchControls.innerHTML = `
    <div class="control-row">
      <div class="control-btn" id="rotate-btn">Girar</div>
    </div>
    <div class="control-row">
      <div class="control-btn" id="move-left">←</div>
      <div class="control-btn" id="move-down">↓</div>
      <div class="control-btn" id="move-right">→</div>
    </div>
  `;
  
  let gameWrapper = document.querySelector('.game-wrapper');
  if (!gameWrapper) {
    gameWrapper = document.createElement('div');
    gameWrapper.className = 'game-wrapper';
    
    document.body.insertBefore(gameWrapper, gameElement);
    gameWrapper.appendChild(gameElement);
  }
  
  gameWrapper.appendChild(touchControls);
  
  document.getElementById('move-left').addEventListener('touchstart', function(e) {
    simulateKeyEvent('ArrowLeft');
    e.preventDefault();
  });
  
  document.getElementById('move-right').addEventListener('touchstart', function(e) {
    simulateKeyEvent('ArrowRight');
    e.preventDefault();
  });
  
  let downButtonInterval = null;
  
  const downButton = document.getElementById('move-down');
  
  downButton.addEventListener('touchstart', function(e) {
    e.preventDefault();
    
    simulateKeyEvent('ArrowDown');
    
    downButtonInterval = setInterval(function() {
      simulateKeyEvent('ArrowDown');
    }, 100); 
  });
  
  downButton.addEventListener('touchend', function(e) {
    e.preventDefault();
    
    if (downButtonInterval) {
      clearInterval(downButtonInterval);
      downButtonInterval = null;
    }
  });
  
  downButton.addEventListener('touchcancel', function(e) {
    e.preventDefault();
    
    if (downButtonInterval) {
      clearInterval(downButtonInterval);
      downButtonInterval = null;
    }
  });
  
  document.getElementById('rotate-btn').addEventListener('touchstart', function(e) {
    simulateKeyEvent('w');
    e.preventDefault();
  });
}

function adjustMobileLayout() {
  if (window.innerWidth <= 600) {
    const tetrisCanvas = document.getElementById('tetris');
    const nextCanvas = document.getElementById('next');
    
    if (tetrisCanvas) {
      const ctx = tetrisCanvas.getContext('2d');
      const scale = 200 / 240; 
      
      tetrisCanvas.style.width = '200px';
      tetrisCanvas.style.height = '333px';
    }
    
    const scoreboard = document.querySelector('.scoreboard');
    if (scoreboard) {
      const scoreLabels = scoreboard.querySelectorAll('p');
      if (scoreLabels.length > 0) {
        scoreLabels[0].innerHTML = 'Pts: <span id="score">0</span>';
        scoreLabels[1].innerHTML = 'Nv: <span id="level">0</span>';
        scoreLabels[2].innerHTML = 'Lin: <span id="lines">0</span>';
      }
    }
  }
}

function simulateKeyEvent(key) {
  const event = new KeyboardEvent('keydown', { key: key, bubbles: true });
  document.dispatchEvent(event);
}

function preventScrolling() {
  document.addEventListener('keydown', function(e) {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'q', 'w'].includes(e.key)) {
      e.preventDefault();
    }
  });
  
  const viewportMeta = document.querySelector('meta[name="viewport"]');
  if (viewportMeta) {
    viewportMeta.setAttribute('content', 
      'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
  }
}

window.addEventListener('resize', adjustMobileLayout);