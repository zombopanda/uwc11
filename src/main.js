var worldEl = document.getElementById('world');
var world = World.get();

var cellView = function (cell) {
  var el = document.createElement('div');
  el.className = 'cell dead';

  cell.onUpdate(function () {
    el.className = cell.isAlive() ? 'cell alive' : 'cell dead';
  });

  el.onclick = function () {
    cell.setAlive(!cell.isAlive());
    return false;
  };

  return el;
};

var menuView = function () {
  var speeds = [
    {'name': '1x', 'value': 1000},
    {'name': '2x', 'value': 500},
    {'name': '5x', 'value': 200},
    {'name': '10x', 'value': 100},
    {'name': '20x', 'value': 50}
  ];
  var speed = 0;
  var generationEl = document.getElementById('generation');
  var playEl = document.getElementById('play');
  var pauseEl = document.getElementById('pause');
  var speedEl = document.getElementById('speed');
  var scaleWrapEl = document.getElementById('scale-wrap');
  var lifeInterval;
  var scale = 1;

  playEl.onclick = function () {
    var run = function () {
      requestAnimationFrame(function () {
        World.nextGeneration();
      });
    };

    lifeInterval = setInterval(run, speeds[speed].value);
    render();
    run();
  };

  pauseEl.onclick = function () {
    clearInterval(lifeInterval);
    lifeInterval = undefined;
    render();
  };

  document.getElementById('stop').onclick = function () {
    clearInterval(lifeInterval);
    lifeInterval = undefined;
    World.reset();
    render();
  };

  document.getElementById('slower').onclick = function () {
    if (speed !== 0) {
      speed--;
    }
    if (lifeInterval) {
      pauseEl.onclick();
      playEl.onclick();
    } else {
      render();
    }
  };

  document.getElementById('faster').onclick = function () {
    if (speed !== speeds.length - 1) {
      speed++;
    }
    if (lifeInterval) {
      pauseEl.onclick();
      playEl.onclick();
    } else {
      render();
    }
  };

  document.getElementById('zoom-in').onclick = function () {
    if (scale.toFixed(2) == 2) return;
    scale += 0.2;
    scaleWrapEl.style.transform = 'scale('+scale+')';
    updateWorldElWidth();
  };

  document.getElementById('zoom-out').onclick = function () {
    if (scale.toFixed(2) == 0.2) return;
    scale -= 0.2;
    scaleWrapEl.style.transform = 'scale('+scale+')';
    updateWorldElWidth();
  };

  document.getElementById('random').onclick = function () {
    World.random();
  };

  document.getElementById('prev').onclick = function () {
    requestAnimationFrame(function () {
      World.prevGeneration();
    });
  };

  document.getElementById('next').onclick = function () {
    requestAnimationFrame(function () {
      World.nextGeneration();
    });
  };

  var render = function () {
    if (lifeInterval) {
      playEl.style.display = 'none';
      pauseEl.style.display = 'block';
    } else {
      playEl.style.display = 'block';
      pauseEl.style.display = 'none';
    }

    speedEl.innerHTML = speeds[speed].name;
    generationEl.innerHTML = World.getGenerationNumber();
  };

  World.onUpdate(function() {
    render();
  });
  render();
};

var updateWorldElWidth = function () {
  worldEl.style.width = (worldEl.querySelector('.cell').offsetWidth * world[0].length) + 'px';
};

var renderWorld = function () {
  for (var i = 0; i < world.length; i++) {
    var row = document.createElement('div');
    row.className = 'row';

    for (var j = 0; j < world[i].length; j++) {
      row.appendChild(cellView(world[i][j]));
    }
    worldEl.appendChild(row);
  }

  updateWorldElWidth();
};

renderWorld();
menuView();
