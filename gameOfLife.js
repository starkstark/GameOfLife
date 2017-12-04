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
  1,0,0,0,0,0,0,0,0,0,
  0,1,0,0,0,0,0,0,0,0,
  0,0,1,0,0,0,0,0,0,0,
  0,0,0,1,0,0,0,0,0,0,
  0,0,0,0,1,0,0,0,0,0,
  0,0,0,0,0,1,0,0,0,0,
  0,0,0,0,0,0,1,0,0,0,
  0,0,0,0,0,0,0,1,0,0,
  0,0,0,0,0,0,0,0,1,0,
  1,1,1,1,1,1,1,1,1,1
];

const GRID_WIDTH  = 10;
const GRID_HEIGHT = 10;

var GRID_DATA = [
  1,0,0,0,0,0,0,0,0,0,
  0,1,0,0,0,0,0,0,0,0,
  0,0,1,0,0,0,0,0,0,0,
  0,0,0,1,0,0,0,0,0,0,
  0,0,0,0,1,0,0,0,0,0,
  0,0,0,0,0,1,0,0,0,0,
  0,0,0,0,0,0,1,0,0,0,
  0,0,0,0,0,0,0,1,0,0,
  0,0,0,0,0,0,0,0,1,0,
  1,1,1,1,1,1,1,1,1,1
];

var GRID_UPDATE = [
  1,0,0,0,0,0,0,0,0,0,
  0,1,0,0,0,0,0,0,0,0,
  0,0,1,0,0,0,0,0,0,0,
  0,0,0,1,0,0,0,0,0,0,
  0,0,0,0,1,0,0,0,0,0,
  0,0,0,0,0,1,0,0,0,0,
  0,0,0,0,0,0,1,0,0,0,
  0,0,0,0,0,0,0,1,0,0,
  0,0,0,0,0,0,0,0,1,0,
  1,1,1,1,1,1,1,1,1,1
];

const CANVAS        = document.getElementById('myCanvas');
const CANVAS_WIDTH  = CANVAS.width;
const CANVAS_HEIGHT = CANVAS.height;

var STOP = true;
var FADING = true;
var ALIVE = [false, false, false, false, false, false, false, false, false];
var FRAME_SPEED = 500;

draw(255);

// ----------------------------------------------------
// onSubmit
// ----------------------------------------------------

function startAnimation() {
	//var form = document.getElementById("myForm").submit();

	for(var x = 0; x < 9; x++) {
		var idStr = 'live' + x;
		ALIVE[x] = document.getElementById(idStr).checked;
	}

	if(document.getElementById("fade1").checked) {
		FADING = true;

	} else {
		FADING = false;

	}

	FRAME_SPEED = document.getElementById("speed").value;

	if(STOP) {
		STOP = false;
		animateGrid();
	}
}

// ----------------------------------------------------

// draws grid data to canvas
function draw(alpha) {
  var ctx = CANVAS.getContext("2d");
  var imgData = ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  var wratio = CANVAS_WIDTH  / GRID_WIDTH;
  var hratio = CANVAS_HEIGHT / GRID_HEIGHT;

  for(var i = 0; i < GRID_HEIGHT; i++) {
    for(var j = 0; j < GRID_WIDTH; j++) {

      //draw rectangle
      for(var x = 0; x < wratio; x++) {
        var height = (i * hratio + x) * CANVAS_WIDTH;
        for(var y = 0; y < hratio; y++) {
          var width = (j * wratio + y);
          var coord = (height + width) * 4;
          var cell = i * GRID_WIDTH + j;
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
          		if(FADING) {
          			imgData.data[coord + 0] = 0;
          	  	imgData.data[coord + 1] = 0;
          	  	imgData.data[coord + 2] = 0;
              	imgData.data[coord + 3] = 255 - alpha;
          		} else {
          		  imgData.data[coord + 0] = 0;
          	  	imgData.data[coord + 1] = 0;
          	  	imgData.data[coord + 2] = 0;
              	imgData.data[coord + 3] = 255;
          		}
          	}

          // dead cell
          } else {
          	// new cell
          	if(GRID_UPDATE[cell]) {
          		if(FADING) {
          			imgData.data[coord + 0] = 0;
          	  	imgData.data[coord + 1] = 0;
          	  	imgData.data[coord + 2] = 0;
              	imgData.data[coord + 3] = alpha;

              } else {
          			imgData.data[coord + 0] = 0;
          	  	imgData.data[coord + 1] = 0;
          	  	imgData.data[coord + 2] = 0;
              	imgData.data[coord + 3] = 0;
              }

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

  ctx.putImageData(imgData, 0, 0); 
}

function clearGrid() {
  for(var x = 0; x < GRID_HEIGHT; x++) {
    var width = x * GRID_WIDTH;
    for(var y = 0; y < GRID_WIDTH; y++) {
      GRID_DATA[width + y] = 0;
    }
  }
}

/*
 * returns true iff a fix-point is reached
 *
 */
function fixpoint() {
  for(var x = 0; x < GRID_DATA.length; x++) {
    if(GRID_DATA[x] != GRID_UPDATE[x]) {
      return false;
    }
  }
  return true;
}

//calculates one step of game of life
function gameOfLife() {

  for(var x = 0; x < GRID_HEIGHT; x++) {
    for(var y = 0; y < GRID_WIDTH; y++) {
      var count = 0;

      //count living neighbours
      for(var i = -1; i < 2; i++) {
        for(var j = -1; j < 2; j++) {
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
      //don't count yourselfe
      count--;

      //alive or dead?
			var living = ALIVE[count];

      var update = 0;
      if(living) update = 1;
      GRID_UPDATE[x * GRID_WIDTH + y] = update;
    }
  }
}

function updateGrid() {
	for(var x = 0; x < GRID_DATA.length; x++) {
		GRID_DATA[x] = GRID_UPDATE[x];
	}
}

function animateGrid() {
  STOP = false;
  var frameCount = 0;
  var frameStep  = 5;
  var id = setInterval(frame, frameStep);
  function frame() {
  	frameCount += frameStep;

    if (STOP) {
      clearInterval(id);

    } else {
    	if(frameCount >= FRAME_SPEED) {
    		frameCount -= FRAME_SPEED;
    		updateGrid();
    		gameOfLife();
    	}
  		draw(255 * (frameCount / frameStep));     
    }
  }
}

function stopAnimation() {
  STOP = true;
}


function resetAnimation() {
	//TODO
}