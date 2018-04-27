World = function () {
  var width = 200;
  var height = 200;
  var isCreated = false;
  var map = [];
  var generation = 0;
  var onUpdateListener;
  var generations = [];

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  var get = function () {
    if (!isCreated) {
      create();
    }

    return map;
  };

  var create = function () {
    for (var i = 0; i < height; i++) {
      map[i] = [];
      for (var j = 0; j < width; j++) {
        map[i][j] = new Cell();
      }
    }

    for (var i2 = 0; i2 < height; i2++) {
      for (var j2 = 0; j2 < width; j2++) {
        var neighbors = [];

        if (typeof map[i2-1] !== 'undefined') {
          if (typeof map[i2-1][j2-1] !== 'undefined') {
            neighbors.push(map[i2-1][j2-1])
          }

          neighbors.push(map[i2-1][j2]);

          if (typeof map[i2-1][j2+1] !== 'undefined') {
            neighbors.push(map[i2-1][j2+1])
          }
        }

        if (typeof map[i2][j2-1] !== 'undefined') {
          neighbors.push(map[i2][j2-1])
        }

        if (typeof map[i2][j2+1] !== 'undefined') {
          neighbors.push(map[i2][j2+1])
        }

        if (typeof map[i2+1] !== 'undefined') {
          if (typeof map[i2+1][j2-1] !== 'undefined') {
            neighbors.push(map[i2+1][j2-1])
          }

          neighbors.push(map[i2+1][j2]);

          if (typeof map[i2+1][j2+1] !== 'undefined') {
            neighbors.push(map[i2+1][j2+1])
          }
        }

        map[i2][j2].setNeighbors(neighbors)
      }
    }

    isCreated = true;
  };

  var nextGeneration = function() {
    if (generations.length == 5) {
      generations.shift();
    }
    generations.push(save());

    for (var i = 0; i < height; i++) {
      for (var j = 0; j < width; j++) {
        map[i][j].nextGeneration();
      }
    }

    generation++;
    onUpdateListener();
  };

  var prevGeneration = function() {
    if (generations.length > 0) {
      var g = generation;
      load(generations.pop());
      generation = g - 1;
      onUpdateListener();
    }
  };

  var reset = function () {
    for (var i = 0; i < height; i++) {
      for (var j = 0; j < width; j++) {
        map[i][j].reset();
      }
    }

    generation = 0;
    onUpdateListener();
  };

  var load = function (data) {
    if (!isCreated) {
      create();
    }
    reset();
    data.forEach(function (el) {
      var coordinates = el.split(' ');
      map[coordinates[0]][coordinates[1]].setAlive(true);
    })
  };

  var save = function () {
    var data = [];
    for (var i = 0; i < height; i++) {
      for (var j = 0; j < width; j++) {
        if (map[i][j].isAlive()) {
          data.push(i + ' ' + j);
        }
      }
    }
    return data;
  };

  var random = function () {
    reset();

    for (var i = 0; i < height; i++) {
      for (var n = 0; n < width / 20; n++) {
        map[i][getRandomInt(0, width)].setAlive(true);
      }
    }

    generation = 1;
    onUpdateListener();
  };

  var getGenerationNumber = function() {
    return generation;
  };

  var onUpdate = function (fx) {
    onUpdateListener = fx;
  };

  return {
    get: get,
    nextGeneration: nextGeneration,
    prevGeneration: prevGeneration,
    getGenerationNumber: getGenerationNumber,
    onUpdate: onUpdate,
    reset: reset,
    load: load,
    save: save,
    random: random
  }
}();
