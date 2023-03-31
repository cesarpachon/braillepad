import React from "react";
import BRAILLE from './codes.js';


let ctx = null;
let TOUCHES = [];
let timeoutid = null;

const BrailleCanvas = ({ onChange }) => {
  const canvasRef = React.useRef();

  function draw() {
    const height=window.innerHeight; 
    const width=window.innerWidth;
    ctx.fillStyle = "rgb(200, 0, 0)";
    ctx.fillRect(10, 10, 50, 50);
    ctx.font = "30px Arial";
    ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
    ctx.fillRect(30, 30, 50, 50);

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(width, height);
    ctx.moveTo(width, 0);
    ctx.lineTo(0, height);
    ctx.stroke();
  }

  function drawTouches() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight); 
    const radius = 30;
    for(let i=0; i<TOUCHES.length; i+=1) {
      const touch = TOUCHES[i];
      const x = touch.clientX;
      const y = touch.clientY;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
      ctx.fillStyle = 'green';
      ctx.fill();
      ctx.lineWidth = 5;
      ctx.strokeStyle = '#003300';
      ctx.stroke();
      ctx.fillStyle = 'black';
      ctx.fillText(`${i+1}`, x - 10, y + 10); 
    };
  }

  /**
   * core part
   * when timeout expires, we have a bunch of touches stored.
   * we need to deduce what braille point are based on relative distances...
   * ideal approach: have a SETUP mode that let the user to decide
   * arbitrary position for each point.
   * easiest way: use fixed boxes!
  */
  function processTouches() {
    const pressed = [0, 0, 0, 0, 0, 0];
    const height=window.innerHeight; 
    const width=window.innerWidth;
    for(let i=0; i<TOUCHES.length; i+=1) {
      const touch = TOUCHES[i];
      if(touch.clientX < width*0.5) {
        // 1, 2 or 3
        if ((touch.clientY) < height * 0.33) {
          pressed[0] = 1;
        } else if ((touch.clientY) > height * 0.66) {
          pressed[2] = 1;
        } else {
          pressed[1] = 1;
        }
      } else {
        // 4, 5, or 6
        if (touch.clientY < height * 0.33) {
          pressed[3] = 1;
        } else if (touch.clientY > height * 0.66) {
          pressed[5] = 1;
        } else {
          pressed[4] = 1;
        }
      }
    }
    const braillekey = pressed.join('');
    console.log("BRAILLE IS", BRAILLE);
    console.log("BRAILLE find", BRAILLE.find);
    const entry = BRAILLE.find((b) => b.braille === braillekey);
    if(entry) {
      const {braille, label} = entry;
      console.log(braillekey, label);
      onChange(label, braillekey);
    } else {
      onChange(null, null);
    }
  }

  function onTimeout() {
    console.log("touches: ", TOUCHES.length);
    // debugstr=`touches:${TOUCHES.length}`;
    processTouches();
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }

  function onTouchStart(ev) {
    console.log("start");
    ev.preventDefault();
    console.log(ev.touches);
    clearTimeout(timeoutid);
    timeoutid = setTimeout(onTimeout, 400);
    TOUCHES = ev.touches;
    drawTouches();
    return false;
  }

  function onTouchEnd(ev) {
    ev.preventDefault();
    console.log(ev.touches);
    return false;
  }

  React.useEffect(() => {
    const canvas = canvasRef.current;
    ctx = canvas.getContext("2d");
    canvas.ontouchstart = onTouchStart;
    canvas.ontouchend = onTouchEnd;
    canvas.ontouchcancel = onTouchEnd;
    draw();
  });

  return <canvas 
    ref={canvasRef} 
    height={window.innerHeight} 
    width={window.innerWidth} 
  style={{
    position:"absolute",
    top: 0,
    left: 0,
  }}
/>;
};

export default BrailleCanvas;
