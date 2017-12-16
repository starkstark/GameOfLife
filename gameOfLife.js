/*
MIT License

Copyright (c) 2017 Manuel Stark

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

// ----------------------------------------------------
// variables
// ----------------------------------------------------

const GRID_DEFAULT = [
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0
];

const GRID_WIDTH  = 10;
const GRID_HEIGHT = 10;

var GRID_DATA = [
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0
];

var GRID_UPDATE = [
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0
];

const CANVAS      = document.getElementById('myCanvas');
//var WIDTH_RATIO   = CANVAS.width  / GRID_WIDTH;
//var HEIGHT_RATIO  = CANVAS.height / GRID_HEIGHT;

var STOP  = true;
var GRID  = true;
var ALIVE = [false, false, false, false, false, false, false, false, false];

var ANIMATION_SPEED_CHANGED = false;

// initialize

resizeEvent();
initOptions();
draw();
updateStatistics();
window.addEventListener('resize', resizeEvent);

// ----------------------------------------------------
// Resize Event
// ----------------------------------------------------

function resizeEvent(){
  var width  = 0.49 * document.documentElement.clientWidth;
  var height = 0.6 * document.documentElement.clientHeight;

  WIDTH_RATIO   = Math.round(width  / GRID_WIDTH);
  HEIGHT_RATIO  = Math.round(height / GRID_HEIGHT);

  CANVAS.width  = Math.floor(1.0 * WIDTH_RATIO  * GRID_WIDTH);
  CANVAS.height = Math.floor(1.0 * HEIGHT_RATIO * GRID_HEIGHT);
  draw();
}

// ----------------------------------------------------
// Option Events
// ----------------------------------------------------

function initOptions() {
  livingChange();
  gridChange();
  animationSpeedChange();
}

function livingChange() {
  for(var x = 0; x < 9; x++) {
    var idStr = 'live' + x;
    ALIVE[x] = document.getElementById(idStr).checked;
  }
  gameOfLife();
  draw();
}

function gridChange() {
  GRID = document.getElementById("grid").checked;
  draw();
}

function animationSpeedChange() {
  var ANIMATION_SPEED_CHANGED = true;
}

// ----------------------------------------------------
// Animation Control
// ----------------------------------------------------

function animation() {
	if(STOP) {
		startAnimation();
	} else {
		stopAnimation();
	}
}

function startAnimation() {
	STOP = false;
	var animateButton = document.getElementById("animationButton");
	animateButton.innerHTML = "Stop";
	animateGrid();
}

function stopAnimation() {
  STOP = true;
	var animateButton = document.getElementById("animationButton");
	animateButton.innerHTML = "Animate";
}

function resetAnimation() {
	stopAnimation();

	for(var x = 0; x < GRID_DATA.length; x++) {
		GRID_DATA[x]   = GRID_DEFAULT[x];
		GRID_UPDATE[x] = GRID_DEFAULT[x];
	}
	draw();
}

function nextStepAnimation() {
	stopAnimation();

	gameOfLife();
	updateGrid();
	gameOfLife();
	draw();
}

// ----------------------------------------------------
// Drawing
// ----------------------------------------------------

// draws grid data to canvas
function draw() {

  const widthRatio  = CANVAS.width  / GRID_WIDTH;
  const heightRatio = CANVAS.height / GRID_HEIGHT;

  var ctx = CANVAS.getContext("2d");
  var imgData = ctx.getImageData(0, 0, CANVAS.width, CANVAS.height);

  for(var i = 0; i < GRID_HEIGHT; i++) {
    for(var j = 0; j < GRID_WIDTH; j++) {
    	var cell = i * GRID_WIDTH + j;
      //draw rectangle
      for(var x = 0; x < heightRatio; x++) {
        var height = Math.round(i * heightRatio + x) * CANVAS.width;

        for(var y = 0; y < widthRatio; y++) {
          var width = Math.round(j * widthRatio) + y;

          var coord = (height + width) * 4;
          // living cell
          if(GRID_DATA[cell]) {

          	// healty cell
          	if(GRID_UPDATE[cell]) {
          		imgData.data[coord + 0] = 0;
          	  imgData.data[coord + 1] = 0;
          	  imgData.data[coord + 2] = 0;
              imgData.data[coord + 3] = 255;

          	// dying cell
          	} else {
        			imgData.data[coord + 0] = 126;
        	  	imgData.data[coord + 1] = 0;
        	  	imgData.data[coord + 2] = 0;
            	imgData.data[coord + 3] = 255;
          	}

          // dead cell
          } else {
          	// new cell
          	if(GRID_UPDATE[cell]) {
        			imgData.data[coord + 0] = 0;
        	  	imgData.data[coord + 1] = 126;
        	  	imgData.data[coord + 2] = 0;
            	imgData.data[coord + 3] = 255;

          	// dead cell
          	} else {
							imgData.data[coord + 0] = 255;
          	  imgData.data[coord + 1] = 255;
          	  imgData.data[coord + 2] = 255;
              imgData.data[coord + 3] = 255;          		
          	}
          }
        }
      }
    }
  }

  //draw grid
  if(GRID) {
	  for(var i = 0; i < CANVAS.height; i++) {
	  	var height = i * CANVAS.width * 4;
	  	for(var j = 0; j < CANVAS.width; j++) {
	  		var coord = height + j * 4;
	  		if(i % HEIGHT_RATIO < 1 || j % WIDTH_RATIO < 1 ) {
					imgData.data[coord + 0] = 126;
	    	  imgData.data[coord + 1] = 126;
	    	  imgData.data[coord + 2] = 126;
	        imgData.data[coord + 3] = 255;   
	  		}
	  	}
	  }
  }

  ctx.putImageData(imgData, 0, 0); 
}

function clearGrid() {
  for(var x = 0; x < GRID_DATA.length; x++) {
		GRID_DATA[x]   = 0;
		GRID_UPDATE[x] = 0;
	}
}

/*
 * returns true iff a fixpoint is reached
 * Stops animation iff fixpoint is reached
 */
function fixpoint() {
  for(var x = 0; x < GRID_DATA.length; x++) {
    if(GRID_DATA[x] != GRID_UPDATE[x]) {
      return false;
    }
  }
  stopAnimation();
  return true;
}

//calculates one step of game of life
function gameOfLife() {

  for(var x = 0; x < GRID_HEIGHT; x++) {
    for(var y = 0; y < GRID_WIDTH; y++) {
      var count = 0;

      //count living neighbours
      for(var i = -1; i <= 1; i++) {
        for(var j = -1; j <= 1; j++) {
          if(i == 0 && j == 0) continue;
          x2 = x + i;
          y2 = y + j;
          if(x2 >= 0 && x2 < GRID_HEIGHT) {
            if(y2 >= 0 && y2 < GRID_WIDTH) {
              if(GRID_DATA[x2 * GRID_WIDTH + y2] == 1) {
                count++;
              }
            }
          }
        }
      }

      GRID_UPDATE[x * GRID_WIDTH + y] = ALIVE[count];
    }
  }

  updateStatistics();
}


function updateGrid() {
	for(var x = 0; x < GRID_DATA.length; x++) {
		GRID_DATA[x] = GRID_UPDATE[x];
	}
}

function animateGrid() {
  STOP = false;
  var speed = (101 - document.getElementById("speed").value) * 10;
  var id = setInterval(frame, speed);
  function frame() {
    if (STOP || ANIMATION_SPEED_CHANGED) {
      clearInterval(id);
      if(ANIMATION_SPEED_CHANGED) {
        ANIMATION_SPEED_CHANGED = false;
        animateGrid();
      }

    } else {
      updateGrid();
      gameOfLife();
      draw();
    }
  }

}

function canvasClicked(event) {
	//console.log('canvas was clicked');
  const pos_left = event.pageX - event.currentTarget.offsetLeft;
  const pos_top  = event.pageY - event.currentTarget.offsetTop;
  //console.log(pos_left, pos_top);
  const xGrid = Math.floor(pos_left / WIDTH_RATIO);
  const yGrid = Math.floor(pos_top  / HEIGHT_RATIO);

  GRID_DATA[yGrid * GRID_WIDTH + xGrid] = !GRID_DATA[yGrid * GRID_WIDTH + xGrid];

  gameOfLife();
  draw();
}

function updateStatistics() {
  var healhtyCount  = 0;
  var deadCount     = 0;
  var dyingCount    = 0;
  var emergingCount = 0;

  //count cells
  for(var i = 0; i < GRID_HEIGHT; i++) {
    var width = i * GRID_WIDTH;
    
    for(var j = 0; j < GRID_WIDTH; j++) {
      var cell = width + j;

      if(GRID_DATA[cell]) {
        if(GRID_UPDATE[cell]) {
          healhtyCount++;
        } else {
          dyingCount++;
        }

      } else {
        if(GRID_UPDATE[cell]) {
          emergingCount++;
        } else {
          deadCount++;
        }
      }
    }
  }

  document.getElementById("healthyCells").innerHTML  = healhtyCount;
  document.getElementById("deadCells").innerHTML     = deadCount;
  document.getElementById("dyingCells").innerHTML    = dyingCount;
  document.getElementById("emergingCells").innerHTML = emergingCount;

  var fixpointField = document.getElementById("fixpoint");
  if(fixpoint()) {
    fixpointField.innerHTML = "Fixpoint";
  } else {
    fixpointField.innerHTML = "No Fixpoint";
  }

}