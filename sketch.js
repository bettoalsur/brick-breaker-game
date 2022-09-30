let dimx = window.innerWidth;
let dimy = window.innerHeight;
let margin = 0.1*dimy;

let ball;
let bar;
let bricks = [];

function setup() {
  createCanvas(dimx,dimy);
  ball = new Ball();
  bar = new Bar();
  
  let numx = 7
  let numy = 5;
  
  let w = width/2/numx; 
  let h = 15;
  let sepx = width/(numx+1);
  let sepy = 2*h;
  
  for (let row = 0 ; row < numy ; row ++) {
    for (let col = 0 ; col < numx ; col ++ ) {
      let hu = row/numy*360;
      bricks.push( new Brick(sepx*(col+1),sepy*(row+1),w,h,hu) );
    }
  }
}

function draw() {
  
  background(25);
  
  stroke(255);
  strokeWeight(1);
  line(0,height-margin,width,height-margin);
  
  ball.bounce();
  ball.contact(bar);
  ball.checkGameOver();
  let lastBrick = bricks[bricks.length-1];
  if (ball.position.y <= lastBrick.y + 2*lastBrick.h + ball.d/2) {
    bricks.forEach(brick => brick.checkContact(ball) );
  }
  
  ball.update();
  bar.update();
  bricks = bricks.filter(brick => !brick.hit);
  
  ball.show();
  bar.show();
  bricks.forEach(brick => brick.show() );
  
  if (bricks.length == 0) {
    noLoop();
    textAlign(CENTER,CENTER);
    textSize(50);
    noStroke();
    fill(100,255,100);
    text("YOU WIN!", width/2 , height/2);
  }
  
}

class Ball {
  constructor(){
    this.position = createVector(width/2,height-margin-11-20)
    this.velocity = createVector(0,-1);
    this.velocity.add(createVector(random(-1,1),0));
    this.velocity.mult(7);
    this.d = 20;
  }
  
  update() {
    this.position.add(this.velocity);
  }
  
  bounce() {
    if(this.position.y <= this.d/2 ) {
      this.position.y = this.d/2 + 1;
      this.velocity.y*=-1;
    }
    if (this.position.x <= this.d/2 ) {
      this.position.x = this.d/2 + 1;
      this.velocity.x*=-1;
    }
    if ( this.position.x >= width - this.d/2) {
      this.position.x = width - this.d/2 - 1;
      this.velocity.x*=-1;
    }
  }
  
  contact(bar) {
    if (this.position.y >= height - this.d/2 - bar.w - margin && this.position.x >= bar.x - bar.l/2 - this.d/2 && this.position.x <= bar.x + bar.l/2 + this.d/2) {
      this.velocity.y *= -1;
      this.position.y = height - this.d/2 - bar.w - margin - 1;
      let local = this.position.x - bar.x; 
      let influence = createVector(map(local,-bar.l/2,bar.l/2,-1,1),0);
      this.velocity.add(influence);
      this.velocity.limit(7);
    }
  }
  
  checkGameOver () {
    if(this.position.y >= height-this.d/2-margin) {
      noLoop();
      textAlign(CENTER,CENTER);
      textSize(50);
      noStroke();
      fill(255,100,100);
      text("GAME OVER!", width/2 , height/2);
    }
  }
  
  show() {
    stroke(255,100,100);
    strokeWeight(this.d);
    point(this.position.x,this.position.y);
  }
}


class Bar {
  constructor() {
    this.x = width/2;
    this.w = 10;
    this.l = width/4;
  }
  
  update() {
    this.x = mouseX;
  }
  
  show() {
    stroke(255);
    noFill();
    strokeWeight(this.w);
    line(this.x-this.l/2,height-this.w/2-margin,this.x+this.l/2,height-this.w/2-margin)
  }
}

class Brick {
  constructor (x0,y0,w,h,hu) {
    this.x = x0;
    this.y = y0;
    this.w = w;
    this.h = h;
    this.hu = hu
    this.hit = false;
  }
  
  checkContact(ball) {
    if( abs(ball.position.x - this.x) <= this.w/2 + ball.d/2 && abs(ball.position.y - this.y) <= this.h/2 + ball.d/2) {
      this.hit = true;
      let angRef = Math.atan(this.h/this.w);
      let ang = Math.atan(abs(ball.position.y - this.y)/abs(ball.position.x - this.x));
      if ( ang >= angRef ) {
        ball.velocity.y *= -1;
      } else {
        ball.velocity.x *= -1; 
      }
    }
  }
  
  show() {
    colorMode(HSB);
    rectMode(CENTER);
    fill(this.hu,255,255);
    noStroke();
    rect(this.x,this.y,this.w,this.h);
    colorMode(RGB);
  }
}