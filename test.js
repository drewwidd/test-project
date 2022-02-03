//get container for our canvas
const sketchContainer = document.getElementById("sketch-container");

//get socket which only uses websockets as a means of communication
const socket = io("ws://44.201.208.251:8080");
var mySocketId = "";

socket.on("connect", () => {
    mySocketId = socket.id;
    console.log("My socket id is: "+mySocketId);
  });
//the p5js sketch
const sketch = (p) => {
  let positions = {};
  //let wizardImage;
  var canvasWidth = 1920 * 0.85;
  var canvasHeight = 1080 * 0.85;
  var characterSize = 50;
  var positionX = canvasWidth/2- characterSize/2;
  var positionY = canvasHeight/2 - characterSize/2;

  //the p5js setup function
  p.setup = () => {
    //wizardImage = p.loadImage('wizard.png');
    //to fill up the full container, get the width an height
    const containerPos = sketchContainer.getBoundingClientRect();
    const cnv = p.createCanvas(canvasWidth,canvasHeight);
  
    /*cnv.mousePressed(() => {
        positionX = p.mouseX;
        positionY = p.mouseY;
        updatePosition();
    });*/
    p.frameRate(30); //set framerate to 30, same as server
    socket.on("positions", (data) => {
      //get the data from the server to continually update the positions
      positions = data;
    });
  };

  //the p5js draw function, runs every frame rate
  //(30-60 times / sec)
  p.draw = () => 
  {
    checkInputs();
    p.background(0); //reset background to black
    //draw a circle for every position

    //sae off my position and draw me last (so I appear on top)
    var myPosition = null;
    p.fill(255,255,255); //sets the fill color of the circle to white
    for (const id in positions) 
    {
       if(id==mySocketId)
       {
           myPosition = positions[id];
           continue;
       }
      const position = positions[id];
      p.circle(position.x, position.y, characterSize);
    }
    if(myPosition!=null)
    {
        p.fill(255,0,0);
        p.circle(myPosition.x, myPosition.y, characterSize);
        //var drawingX = myPosition.x-(characterSize/2);
        //var drawingY = myPosition.y-(characterSize/2);
        //console.log("Drawing at "+drawingX + " " +drawingY);
        //p.image(wizardImage,drawingX,drawingY,characterSize,characterSize);
    }
  };

  checkInputs = () => {
    var speed = 10;
    if(p.keyIsDown(p.UP_ARROW) || p.keyIsDown(87))
    {
        positionY -= speed;
    }
    if(p.keyIsDown(p.DOWN_ARROW) || p.keyIsDown(83))
    {
        positionY += speed;
    }
    if(p.keyIsDown(p.LEFT_ARROW) || p.keyIsDown(65))
    {
        positionX -= speed;
    }
    if(p.keyIsDown(p.RIGHT_ARROW) || p.keyIsDown(68))
    {
        positionX += speed;
    }
    if(p.keyIsDown(32))
    {
        positionX = p.mouseX;
        positionY = p.mouseY;
    }
    /*switch(p.key)
    {
        case 'ArrowUp':
        case 'w':
            break;
        case 'ArrowDown':
        case 's':
            positionY += speed;
            break;
        case 'ArrowLeft':
        case 'a':
            positionX -= speed;
            break;
        case 'ArrowRight':
        case 'd':
            positionX += speed;
            break;
    }*/
    if(positionX<0) { positionX = 0; }
    if(positionY<0) { positionY = 0; }
    if(positionX>canvasWidth) { positionX = canvasWidth; }
    if(positionY>canvasHeight) { positionY = canvasHeight; }
    console.log(positionX + " " +positionY);
    updatePosition();
  };

  updatePosition = () =>
  {
    socket.emit("updatePosition", {
        x: positionX,
        y: positionY
      });
  }
};


//initialize the sketch!
new p5(sketch, sketchContainer);