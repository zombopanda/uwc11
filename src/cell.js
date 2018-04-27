Cell = function () {
  var alive = false;
  var neighbors = [];
  var onUpdateListener;

  var setNeighbors = function(cells) {
    neighbors = cells;
  };

  var nextGeneration = function () {
    var aliveNeighbors = 0;
    for(var i = 0; i < neighbors.length; i++) {
      if (neighbors[i].isAlive()) {
        aliveNeighbors++;
      }
    }

    if (alive) {
      if (aliveNeighbors <= 1 || aliveNeighbors >= 4) {
        setAlive(false);
      }
    } else {
      if (aliveNeighbors === 3) {
        setAlive(true);
      }
    }
  };

  var isAlive = function () {
    return alive;
  };

  var setAlive = function (val) {
    alive = val;
    onUpdateListener(val);
  };

  var reset = function () {
    if (alive) {
      setAlive(false);
    }
  };

  var onUpdate = function (fx) {
    onUpdateListener = fx;
  };

  return {
    isAlive: isAlive,
    setNeighbors: setNeighbors,
    nextGeneration: nextGeneration,
    onUpdate: onUpdate,
    setAlive: setAlive,
    reset: reset
  }
};
