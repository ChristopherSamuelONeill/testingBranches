var canvas = document.getElementById("breakout");
var ctx = canvas.getContext("2d");

var keysDown = {};

var score = 0;
var lives = 3;


var bricks = []; 
var balls = [];
//var ballSpeedMultiplier = 3; // used to control ball speed
var brickCount = 56;
var curLevel = 1;
var bRun = 0; //bool for a one time run
var ballCount =0;
var pUpisFalling =0; // 1 when falling
var paused = 0; // 1 when paused
var wait3seconds = 0;
var pausedTime =0;
var power ="";
var tempBall;

var globalElapsed;





var powerUP = {
	x : 500,
	y : 0,
	height: 40,
	width: 40,
	speed: 150,
	visible: 0
}

var paddle = {
	x: 500,
	y: 850,
	height: 15,
	width: 250,
	speed: 300

}

function ball(x,y,xSpeed,ySpeed,radius,visible,fire)
{
	this.x = x;
	this.y = y;
	this.xSpeed = xSpeed;
	this.ySpeed = ySpeed;
	this.radius = radius;
	this.visible = visible;
	this.fire = fire;
	this.bounce = new Audio('Cartoon Clank Sound Effect.wav');
	this.bat = new Audio('Arcade Bloop Sound Effect.wav');
	this.power = new Audio('M4 Reload Final with Sounds.wav');
	
	
}
function Brick(x, y, width, height , colour, visible,hits,health,score)
{
	
	this.x = x;
	this.y = y;
	this.height = height;
	this.width = width;
	this.colour = colour;
	this.visible = visible;
	this.hits = hits;
	this.health = health;
	this.score = score;
	this.brick = new Audio('Punch Sound Effect.wav');
}

function bricklist()
{
	var tempBrick;
	brickCount = 56;
	
	
	
	//row 1
	for(var i =0; i < 14; i++)
	{
		tempBrick = new Brick(i*75 + 90, 80, 50,25,"green",1,0,4,1000)
		bricks.push(tempBrick);
		
	}
	//row 2
	for(var i =0; i < 14; i++)
	{
		tempBrick = new Brick(i*75 + 90, 140, 50,25,"yellow",1,0,3,500)
		bricks.push(tempBrick);
		
	}
	
	//row 3
	for(var i =0; i < 14; i++)
	{
		tempBrick = new Brick(i*75 + 90, 200, 50,25,"orange",1,0,2,200)
		bricks.push(tempBrick);
		
	}
	//row 4
	for(var i =0; i < 14; i++)
	{
		tempBrick = new Brick(i*75 + 90, 260, 50,25,"red",1,0,1,100)
		bricks.push(tempBrick);
		
	}
	
}
function powerUpText(power,elapsed)
{ 
	wait3seconds += elapsed;
	
	if(wait3seconds < 3)
	{
		render(power);
	}
	else
	{
		wait3seconds = 0;
		power = 0;
		render(power);
	}
}

function render(power) 
{
  //clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  
  // draw lives#
  if(lives > 0)
  {
		for(var i =0; i < balls.length; i++)
		{
			if(balls[i].visible == 1)
			{
				// draw the ball
				ctx.fillStyle = "white";
				ctx.beginPath();
				ctx.arc(balls[i].x, balls[i].y, balls[i].radius, 0, Math.PI * 2);
				ctx.fill();
			}
		}
	  
	   //text
	  ctx.font = "30px Impact";
	  ctx.fillText("Lives : " + lives , 10 , 30);
	  ctx.fillText("Level : " + curLevel , 1000 , 30);
	  ctx.fillText("Score : " + score , 550 , 30);
	  
	  //draw power up
	  if(powerUP.visible == 1)
	  {
		  ctx.beginPath();
		  ctx.lineWidth = "1";
		  ctx.fillStyle = "white";
		  ctx.rect(powerUP.x, powerUP.y,  powerUP.width, powerUP.height);  
		  ctx.fill();
		  
		  ctx.font = "30px Impact";
		   ctx.fillStyle = "black";
		  ctx.fillText("pUP!" ,powerUP.x , powerUP.y+20);
	  
		  
	}
	  
	  // draw the paddle
	  ctx.beginPath();
	  ctx.lineWidth = "6";
	  ctx.fillStyle = "white";
	  ctx.rect(paddle.x, paddle.y,  paddle.width, paddle.height);  
	  ctx.fill();
	  
	  // draw bricks
	
	  for(var i =0; i < bricks.length; i++ )
	  {
		  
		  if(bricks[i].visible == 1)
		  {
			ctx.beginPath();
			ctx.lineWidth = "1";
			ctx.fillStyle = bricks[i].colour;
			ctx.rect(bricks[i].x,bricks[i].y,bricks[i].width,bricks[i].height);
			ctx.fill();
		  }
	  }
	  
		ctx.beginPath();
		ctx.font = "35px Impact";
		ctx.fillStyle = "white";
		if(power == 0)
		{
			ctx.fillText("" , 9999 , 9999);
		}
		else
		{
			ctx.fillText(power ,600 , 900);
		}
  }
  else
  {
	  ctx.fillStyle = "white";
	  ctx.font = "50px Impact";
	  ctx.fillText("YOU LOSE!" , 500 , canvas.height/2);
	  ctx.fillText("Press Space to play again" , 350 , canvas.height/2 + 75);
	  balls = [];
	  if(keysDown[32])
	  {
		  restart();
	  }
	  
  }
  
  

  
}
function move(direction)
{
	
	if((direction == 1) && (paddle.x > 0))
		{
			//globalElapsed
			paddle.x -= paddle.speed *0.15;		
		}
		if((direction == -1) && paddle.x + paddle.width < canvas.width)
		{
				
			paddle.x += paddle.speed * 0.15;
				
		}
	
}

function update(elapsed) {
		
		
	
		if(score%1000 == 0 && score != 0 && pUpisFalling == 0 )
		{
			
			pUpisFalling = 1;
			powerUP.y = 0;
			score = score + 100;
			balls[0].bat.play();
		}
		
		if(pUpisFalling == 1)
		{
			
			//make it fall
			powerUP.visible = 1;
			powerUP.y += powerUP.speed * elapsed;
			
			if((powerUP.y + powerUP.height >= paddle.y) && (powerUP.x < paddle.x + paddle.width )&& (powerUP.x + powerUP.width > paddle.x))
			{
				// power up collected
					balls[0].power.play();
				pUpisFalling = 0;
				powerUP.visible = 0 ;
				var x = Math.floor((Math.random() * 10) + 1);
				
						
				// 1 - 10
				if(x == 1)
				{
				
					tempBall = new ball (paddle.x + (paddle.width/2),paddle.y -15,-100*curLevel,-100*curLevel,7,1,0);
					balls.push(tempBall)
					ballCount++;
					power = "New Ball !";
					
					
				}
				if(x == 2)
				{
					power = "BIGGER balls !";
					
					for(var b = 0; b < balls.length; b ++)
					{
						if(balls[b].visible == 1)
						{
							balls[b].radius = balls[b].radius * 1.15;
						}
					}
					
				}
				
				if(x == 3)
				{
					power = "Fire Balls !";
					
					for(var b = 0; b < balls.length; b ++)
					{
						if(balls[b].visible == 1)
						{
							balls[b].fire =1;
						}
					}
					
				}
				if(x == 4)
				{
					power = "Extended paddle !";
					
					paddle.width = paddle.width * 1.10;
					paddle.height = paddle.height * 1.05;
					
				}
				if(x == 5)
				{
					power = "+ 500 score !";
					
					score = score + 500;
					
				}
				if(x == 6)
				{
					power = "Faster paddle";
				
					paddle.speed = paddle.speed * 1.25;
					
					
				}
				if(x == 7)
				{
					power = "MegaBalls !";
					
					for(var b = 0; b < balls.length; b ++)
					{
						if(balls[b].visible == 1)
						{
							balls[b].radius = balls[b].radius * 1.2;
						}
					}
					
				}
				if(x == 8)
				{
					tempBall = new ball (paddle.x + (paddle.width/2),paddle.y -15,-100*curLevel,-100*curLevel,7,1,0);
					balls.push(tempBall)
					ballCount++;
					power = "New Ball !";
					
					
				}
				if(x == 9)
				{
					for(var soooManyBalls = 0; soooManyBalls < 11; soooManyBalls++)
					{
					
					tempBall = new ball (paddle.x + (paddle.width/2),paddle.y -15,-100*curLevel,-100*curLevel,7,1,0);
					balls.push(tempBall)
					ballCount++;
					}
						power = "Ball Shower !";
				
					
					
					
				}
				if(x == 10)
				{
					power = "Extended paddle !";
			
					paddle.width = paddle.width * 1.1;
					paddle.height = paddle.height * 1.2;
					
					
				}
				
				
				
			}
			if(powerUP.y > canvas.height)
			{
				pUpisFalling = 0;
				powerUP.visible = 0 ;
			}
		}
		
		powerUpText(power,elapsed);
		//console.log(power)
		//move paddle
		if(keysDown[37] && (paddle.x > 0))
		{
			paddle.x -= paddle.speed * elapsed;		
		}
		if(keysDown[39] && paddle.x + paddle.width < canvas.width)
		{
				
			paddle.x += paddle.speed * elapsed;
				
		}
		
		
		
	  //update the ball position according to the elapsed time
	 for(var i = 0; i < balls.length; i ++)
		{
		  balls[i].y += balls[i].ySpeed * elapsed;
		  balls[i].x += balls[i].xSpeed * elapsed;
		}

	  //bounce the ball of all edges
	  for(var i = 0; i < balls.length; i ++)
		{
		  if(balls[i].visible == 1)
		  {
			  if(balls[i].x - balls[i].radius <= 0 ) // left edge
			  {
				balls[i].xSpeed *= -1;
				balls[i].x = balls[i].radius;
				balls[i].bounce.play();
			  }
			  if( balls[i].x + balls[i].radius >= canvas.width) // right edge
			  {
				 balls[i].xSpeed *= -1; 
				 balls[i].x = canvas.width - balls[i].radius;
					balls[i].bounce.play();				 
			  }
			  if(balls[i].y - balls[i].radius <= 0) // top edge
			  {	  
				balls[i].ySpeed *= -1;
				balls[i].y = balls[i].radius;
				balls[i].bounce.play();
			  }
			  if(balls[i].y >= canvas.height + balls[i].radius)  // bottom edge
			  {
				  if(ballCount > 1)
				  {
					  balls[i].visible = 0;
					  ballCount--;
				  }
				  else
				  {
				
						lives--;
						paddle.x = 550;
						balls[i].x = paddle.x + (paddle.width/2);
						balls[i].y = paddle.y - balls[i].radius;
						balls[i].ySpeed *= -1;
				  }
				 
				// YOU LOSE!
			  }
		  }
		}
		  
	  // collide with the bat ?
	  for(var i = 0; i < balls.length; i ++)
		{
		  if((balls[i].y + balls[i].radius >= paddle.y && balls[i].y + balls[i].radius <=  paddle.y + paddle.height )&& ((balls[i].x - balls[i].radius <=(paddle.x + paddle.width))&&(balls[i].x + balls[i].radius >= paddle.x))&&(balls[i].visible == 1)) 
		  {
			  // left edge ?
			  if((balls[i].y + balls[i].radius > paddle.y+paddle.height) && ((balls[i].x + balls[i].radius > paddle.x  && balls[i].x + balls[i].radius < paddle.x + paddle.width )||(balls[i].x - balls[i].radius < paddle.x + paddle.width  && balls[i].x + balls[i].radius > paddle.x )))
			  {
					balls[i].xSpeed *= -1;
					balls[i].ySpeed *= -1;
					balls[i].x = (paddle.x + paddle.width) + balls[i].radius;
					balls[i].bounce.play();
			  }
			  else // top of bat
			  {
					balls[i].y = paddle.y - balls[i].radius;
					balls[i].ySpeed *= -1;
						balls[i].bounce.play();
			  }
		  }
		}
	
	  // collide with bricks
		for(var i = 0; i < balls.length; i ++)
		{
		  if(balls[i].visible == 1)
		  {
			 for(var x = 0; x < bricks.length; x++)
			{
				//top of brick
				if(((balls[i].y + balls[i].radius > bricks[x].y) &&( balls[i].y + balls[i].radius < bricks[x].y + bricks.height)) && (balls[i].x - balls[i].radius >= bricks[x].x && balls[i].x + balls[i].radius <= bricks[x].x + bricks[i].width)&& (bricks[x].visible == 1)) //top of brick
				{
					if(balls[i].fire == 0)
					{
						balls[i].ySpeed *= -1;
						
						balls[i].y = bricks[x].y - balls[i].radius;
					}
					bricks[x].brick.play();
					bricks[x].health--;
					
					
					
				}
				//bottom of brick
				else if(bricks[x].visible == 1&&((balls[i].y - balls[i].radius < bricks[x].y + bricks[x].height) &&( balls[i].y - balls[i].radius > bricks[x].y)) && (balls[i].x - balls[i].radius >= bricks[x].x && balls[i].x + balls[i].radius <= bricks[x].x+bricks[x].width)) //bottom of brick
				{
					if(balls[i].fire == 0)
					{
						balls[i].ySpeed *= -1;
						balls[i].y = (bricks[x].y + bricks[x].height) + balls[i].radius;
					}
					
					bricks[x].health--;
					bricks[x].brick.play();
					

					
				}
				//left of brickS
				else if(((balls[i].x + balls[i].radius > bricks[x].x)&&(balls[i].x + balls[i].radius < bricks[x].x + bricks[x].width )) && (balls[i].y + balls[i].radius >= bricks[x].y && balls[i].y - balls[i].radius <= bricks[x].y + bricks[x].height)&&bricks[x].visible == 1)
				{
					if(balls[i].fire == 0)
					{
						balls[i].xSpeed *= -1;
						
						balls[i].x = bricks[x].x - balls[i].radius;
					}
					bricks[x].brick.play();
					bricks[x].health--;
				
				}
				//right of brick
				else if(((balls[i].x - balls[i].radius < bricks[x].x + bricks[x].width)&&(balls[i].x - balls[i].radius > bricks[x].x )) && (balls[i].y + balls[i].radius >= bricks[x].y && balls[i].y - balls[i].radius <= bricks[x].y + bricks[x].height)&&bricks[x].visible == 1)
				{
					if(balls[i].fire == 0)
					{
						balls[i].xSpeed *= -1;
						
						balls[i].x = bricks[x].x + bricks[x].width + balls[i].radius;
					}
					bricks[x].brick.play();
					bricks[x].health--;
				}
				if(bricks[x].health == 0&&bricks[x].visible == 1)
				{
					brickCount --;
					score += bricks[x].score;
					bricks[x].visible = 0;
				}
			}
		  }
		}
		//level over ?
		
		if(brickCount == 0)
		{
			curLevel++;
			//ballSpeedMultiplier = curLevel;		
			bricklist();
			paddle.x = 500;
			paddle.y = 850;
			for(var i = 0; i < balls.length; i ++)
			{		
				balls[i].x = paddle.x + (paddle.width/2); 
				balls[i].y = paddle.y - 10;
			}
			
			
			tempBall = new ball (paddle.x + (paddle.width/2),paddle.y -15,-100*curLevel,-100*curLevel,7,1,0);
			balls.push(tempBall)
			paddle.x = 550;
			ballCount++;
			for(var newBall = 0; newBall < balls.length; newBall++)
			{
				balls[newBall].x = paddle.x + (paddle.width/2);
				balls[newBall].y = paddle.y -15;
				balls[newBall].xSpeed = -100*curLevel;
				balls[newBall].ySpeed = -100*curLevel;
			
				
				
			}
			
		}
	  
}

function restart()
{
	paddle.x = 500;
	paddle.y = 850;
	paddle.height = 15;
	paddle.width = 150;
	paddle.speed = 500;
	
	curLevel = 1;
	//ballSpeedMultiplier = curLevel;

	tempBall = new ball (paddle.x + (paddle.width/2),paddle.y -15,-100*curLevel,-100*curLevel,7,1,0);
	balls.push(tempBall)
	
	score = 0;
	lives = 3;
	
	
	
	bricklist();
	
	
}

var previous;
function run(timestamp) 
{
	if (!previous) previous = timestamp;          //start with no elapsed time
	var inputTime = (timestamp - previous);  //work out the elapsed time
	
	pausedTime += inputTime;
	
	//console.log(inputTime);
	if(pausedTime > 1000)
	{

		if(keysDown[80] )
		{
			
			if(paused == 0)
			{
				paused = 1;
				pausedTime = 0;
			}
			else if(paused == 1)
			{
				paused = 0;
				timestamp = 0; 
				previous =0;
				pausedTime = 0;
			}
		}
	}
	
	if(paused == 0)
	{
		if(bRun == 0)
		{
			
			
			tempBall = new ball (paddle.x + (paddle.width/2),paddle.y -15,-100*curLevel,-100*curLevel,7,1,0);
			balls.push(tempBall)
			paddle.x = 550;
					
			ballCount++;
			bRun =1;
			
		}
		
		
	  if (!previous) previous = timestamp;          //start with no elapsed time
	  var elapsed = (timestamp - previous) / 1000;  //work out the elapsed time
	  globalElapsed = elapsed;
	  update(elapsed);                              //update the game with the elapsed time
			  //ask browser to call this function again, when it's ready
	
	  render(power);                                     //render the scene
	  previous = timestamp;                         //set the (globally defined) previous timestamp ready for next time
		  
		  
		  
	}
	else
	{
		ctx.font = "200px Impact";
		ctx.fillStyle = "white";
		ctx.fillText("PAUSED" ,300 , 300);
		
	}
	
	window.requestAnimationFrame(run);            //ask browser to call this function again, when it's ready
}
bricklist();

//trigger the game loop
window.requestAnimationFrame(run);
window.addEventListener("keydown",function(e){keysDown[e.keyCode] = true;});
window.addEventListener("keyup",function(e){delete keysDown[e.keyCode];});