var PLAY=1;
var END=0;
var gameState=PLAY;

var jumpSound,dieSound,checkPointSound;

var gameOver,gmeOverImage
var restart,restartImage;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloudImage;
var obstacle1,obstacle2,obstacle3,obstacle4,obstacle5,obstacle5;
var score;


function preload(){
  
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided= loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png")
  cloudImage = loadImage("cloud.png")
  
  obstacle1=loadImage("obstacle1.png")
  obstacle2=loadImage("obstacle2.png")
  obstacle3=loadImage("obstacle3.png")
  obstacle4=loadImage("obstacle4.png")
  obstacle5=loadImage("obstacle5.png")
  obstacle6=loadImage("obstacle6.png")
  
  gameOverImage=loadImage("gameOver.png")
  restartImage=loadImage("restart.png")
  
  jumpSound=loadSound("jump.mp3");
  dieSound=loadSound("die.mp3");
  checkPointSound=loadSound("checkPoint.mp3")
  
}

function setup() {
  createCanvas(600, 200);
  score=0;
  //create a trex sprite
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  //adding scale and position to trex
  trex.scale = 0.5;
  trex.x = 50
  
  //create ground sprite
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  //game over sprite
  gameOver=createSprite(300,100);
 gameOver.addImage(gameOverImage)
  gameOver.scale=0.5;
  gameOver.visible=false
  //restart sprite
   restart=createSprite(300,140)
   restart.addImage(restartImage)
   restart.scale=0.5;
  restart.visible=false;
  
  //invisible ground
  invisibleGround=createSprite(200,190,400,10);
  invisibleGround.visible=false;
  
  obstaclesGroup= new Group();
  cloudsGroup= new Group();
  
  
  trex.setCollider("rectangle",0,0,400,trex.height);
  trex.debug=true;
  
}



function draw() {
  background("lightgreen");
  text("score: " +score,500,20);
  
  console.log(gameState);
  
  
  if(gameState===PLAY)
    {
      gameOver.visible=false
      restart.visible=false
      
      //move the ground
      ground.velocityX = -(4 + 3*score/100)
      score=score+Math.round((getFrameRate()/60));
      
      if(score>0 && score%100===0)
        {
          checkPointSound.play();
        }
      
      
      if (ground.x<0){
          ground.x = ground.width/2;
          }
  
      //jumping the trex on space key press
      if(keyDown("space") && trex.y>=100) {
       trex.velocityY = -10;
        jumpSound.play();
        }
      
      //Adding Gravity
      trex.velocityY = trex.velocityY + 0.8
      
      spawnObstacles();
      spawnClouds();
      
      if(obstaclesGroup.isTouching(trex))
        {
          //trex.velocityY=-12;
          gameState=END;
          dieSound.play();
          
        }
      
        }
          else if (gameState===END)
        {
        //game over and restart visibilty
          gameOver.visible=true
          restart.visible=true
          
           if(mousePressedOver(restart))
      {
        reset();
      }
          
          //stop the ground
          ground.velocityX = 0;
          trex.velocityY=0;
          
          //trex image change
          trex.changeAnimation("collided",trex_collided);
      
          
          //reassigning the lifetime
          obstaclesGroup.setLifetimeEach(-1);
          cloudsGroup.setLifetimeEach(-1);
          
          //stopping the cloud.obstacle
          obstaclesGroup.setVelocityXEach(0);
          cloudsGroup.setVelocityXEach(0);
          
        }
  
  
  console.log(ground.x)
  //stop trex from falling down 
  trex.collide(invisibleGround);
 
   
  
  
  drawSprites();
}

function reset()
{
  gameState=PLAY;
  gameOver.visible=false
  restart.visible=false
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running",trex_running)
  score=0;
  
}
function spawnObstacles()
{
  if(frameCount%60===0)
    {
      var obstacle = createSprite(600,165,40,10);
      obstacle.velocityX=-(6 + score/100);
      
      var rand=Math.round(random(1,6))
      switch(rand){
          case 1: obstacle.addImage(obstacle1);
          break;
          
          case 2: obstacle.addImage(obstacle2);
          break;
          
          case 3: obstacle.addImage(obstacle3);
          break;
          
          case 4: obstacle.addImage(obstacle4);
          break;
          
          case 5: obstacle.addImage(obstacle5);
          break;
          
          case 6: obstacle.addImage(obstacle6);
          break;
          
          default: break;
      }
      obstacle.scale=0.5;
      obstacle.lifetime=300;
      obstaclesGroup.add(obstacle);
    }
  
}

function spawnClouds()
{
  if(frameCount%80===0)
    {
      var cloud = createSprite(600,20,40,10);
      cloud.addImage(cloudImage)
      cloud.y=Math.round(random(10,60))
      cloud.scale=random(0.2,0.8)
      cloud.velocityX=-2;
      
      //adjusting the depth
      cloud.depth=trex.depth;
      trex.depth=trex.depth+1;
      
      cloud.lifetime=300;
      cloudsGroup.add(cloud);
      
      
    }
}