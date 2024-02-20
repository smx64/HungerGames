//variable initializations
let totalTributes = 24;
let tributeArray = [];

let tribute_xVel_Choices = [];
let tribute_yVel_Choices = [];
let tribute_Vel_Array = [-4,-3,-2,-1,1,2,3,4];

let countdownScreen = 0;
let countdownArray = [3,2,1];
let countdownColors = [];

let gameMakerTotal = totalTributes;
let gameMakerField;
let gameMakerKeyValue;
let gameMakerButton;

let timer = 1000;
let eventChange = 0;

let countdownFont;
let canonSound;
let gameBGM;
let gameMap;

let click = 0;

//pre-loading game font & background map
function preload()
{
  countdownFont = loadFont("./Oxanium.ttf");
  gameMap = loadImage("./GameMap.jpeg");
}

//declaring class of "Tributes"
class Tributes
{
  constructor(_xVelVar, _yVelVar, _disID)
  {
    this.xPos_Tribute = random(50,windowWidth-50);
    this.yPos_Tribute = random(50,windowHeight-50);
    this.rad_Tribute = 20;
    this.xVel_Tribute = _xVelVar;
    this.yVel_Tribute = _yVelVar;
    this.districtID_Tribute = _disID;
    this.hp_Tribute = 100;
    this.healthBar_Tribute = this.recalculateHP();
    this.attackValue_Tribute = int(random(1,4))*10;
  }
  updateTributePos()
  {
    this.xPos_Tribute+=this.xVel_Tribute;
    this.yPos_Tribute+=this.yVel_Tribute;
    this.checkMapEdge();
    this.checkCollisionAll();
  }
  //checking screen-edge collisions
  checkMapEdge()
  {
    if(this.xPos_Tribute+this.rad_Tribute>=windowWidth || this.xPos_Tribute-this.rad_Tribute<=0)
    {
      this.xVel_Tribute*= -1;
    }

    if(this.yPos_Tribute+this.rad_Tribute>=windowHeight || this.yPos_Tribute-this.rad_Tribute<=0)
    {
      this.yVel_Tribute*= -1;
    }
  }
  //calculating distance for gauging collisions
  checkCollision(otherTribute)
  {
    //ignoring collisions between self & same district ID "Tributes"
    if(this==otherTribute || this.districtID_Tribute==otherTribute.districtID_Tribute)
    {
      return false;
    }
    else
    {
      let tributeDist = dist(this.xPos_Tribute, this.yPos_Tribute, otherTribute.xPos_Tribute, otherTribute.yPos_Tribute);
      if(tributeDist < this.rad_Tribute + otherTribute.rad_Tribute)
      {
        //reducing hitpoints accordingly of both "Tributes" if they collide
        this.hp_Tribute-=otherTribute.attackValue_Tribute;
        otherTribute.hp_Tribute-=this.attackValue_Tribute;
        return true;
      }
    }
  }
  //checking collisions between all "Tributes"
  checkCollisionAll()
  {
    let collision = false;
    for(let i=0; i<tributeArray.length; i++)
    {
      let tributesObject = tributeArray[i];
      if(this.checkCollision(tributesObject))
      {
        collision = true;
      }
    }
    
    if(collision)
    {
      this.healthBar_Tribute = color('DarkViolet');
      if(this.hp_Tribute<=0)
      {
        this.eliminateTribute();
      }
    }
    else
    {
      this.recalculateHP();
    }
  }
  //function for "eliminating Tributes"
  eliminateTribute()
  {
    this.xVel_Tribute = 0;
    this.yVel_Tribute = 0;
    this.xPos_Tribute = -this.rad_Tribute;
    this.yPos_Tribute = -this.rad_Tribute;
    this.rad_Tribute = 0;
    totalTributes--;
    canonSound.play();

    fill(255);
    textAlign(CENTER,CENTER);
    textSize(24);
    text("D"+this.districtID_Tribute, width-50, 50);
  }
  //function for calculating hitpoints & health-color based on collision impact
  recalculateHP()
  {
    if(this.hp_Tribute<=100 && this.hp_Tribute>=90)
    {
      this.healthBar_Tribute = color('Lime');
    }
    else if(this.hp_Tribute<90 && this.hp_Tribute>=70)
    {
      this.healthBar_Tribute = color('GreenYellow');
    }
    else if(this.hp_Tribute<70 && this.hp_Tribute>=50)
    {
      this.healthBar_Tribute = color('Orange');
    }
    else if(this.hp_Tribute<50 && this.hp_Tribute>=30)
    {
      this.healthBar_Tribute = color('Yellow');
    }
    else if(this.hp_Tribute<30 && this.hp_Tribute>=10)
    {
      this.healthBar_Tribute = color('Red');
    }
    else if(this.hp_Tribute<10)
    {
      this.healthBar_Tribute = color(75,0,0);
    }
  }
  //generating circles for every "Tribute"
  tributeCreate()
  {
    fill(this.healthBar_Tribute);

    //generating white stroke every 5 seconds for "GPS dot effect"
    if(floor(eventChange/1000)%5==0)
    {
      stroke(255);
      strokeWeight(5);
    }
    else
    {
      stroke(0);
      strokeWeight(1);
    }

    ellipse(this.xPos_Tribute, this.yPos_Tribute, 2*this.rad_Tribute);
    
    //changing district ID font color based on background circle color
    if(this.hp_Tribute>=30)
    {
      fill(0);
    }
    else
    {
      fill(255);
    }
    strokeWeight(0);
    textAlign(CENTER,CENTER);
    textSize(14);
    text("D"+this.districtID_Tribute, this.xPos_Tribute, this.yPos_Tribute);
    this.gameMarkerOverride();
  }
  //function to bring up the "gamemaker override console"
  gameMarkerOverride()
  {
    if(key=='g')
    {
      //generating text-field
      gameMakerField = createInput();
      gameMakerField.position(20,height-50);
      gameMakerField.size(30);

      //generating button
      gameMakerButton = createButton('Eliminate');
      gameMakerButton.position((gameMakerField.x + gameMakerField.width)+5, gameMakerField.y);
      gameMakerButton.mousePressed(eliminateGM);
    }
  }
}

//function to eliminate "Tribute" based on gamemaker's input value
function eliminateGM()
{
  gameMakerKeyValue = gameMakerField.value();
  gameMakerField.value('');

  let i = gameMakerKeyValue-1;
  let j = i+(gameMakerTotal/2);

  if(tributeArray[i].xVel_Tribute!=0 && tributeArray[i].yVel_Tribute!=0)
  {
    tributeArray[i].eliminateTribute();
  }

  if(tributeArray[j].xVel_Tribute!=0 && tributeArray[j].yVel_Tribute!=0)
  {
    tributeArray[j].eliminateTribute();
  }
}

function setup()
{
  createCanvas(windowWidth, windowHeight);
  canonSound = createAudio("./CanonSound.mp3");
  gameBGM = createAudio("./GameBGM.mp3");
  countdownColors = [color(0,0,75), color(0,25,50), color(0,50,25)];

  //generating blueprint lines for the background
  stroke(255,1);
  strokeWeight(1);
  for(let xPos_Line = 0; xPos_Line <=width; xPos_Line+=40)
  {
    for(let yPos_Line = 0; yPos_Line <=height; yPos_Line+=40)
    {
      line(xPos_Line, 0, xPos_Line, height);
      line(0, yPos_Line, width, yPos_Line);
    }
  }

  fill(0,255,0);
  textAlign(CENTER,CENTER);
  textSize(18);
  textFont("monospace");
  text("GAME LOADED. COMMENCE NOW?", width/2, height/2-60);
  text("- [CLICK HERE] to Initiate Countdown -", width/2, height/2-22);
  text("press [G] in-game to bring up override console", width/2, height/1.11);

  //assigning random 'x' & 'y' velocity values to "Tributes"
  for(let i=0; i<totalTributes; i++)
  { 
    tribute_xVel_Choices.push(random(tribute_Vel_Array));
    tribute_yVel_Choices.push(random(tribute_Vel_Array));
  }

  //initializing Tribute class
  for(let i=0; i<totalTributes; i++)
  {
    //giving unique & sequential district_ID numbers to "Tributes"
    if(i<totalTributes/2)
    {
      distID=i;
    }
    else
    {
      distID=i-(totalTributes/2)
    }
    let tributesObject = new Tributes(tribute_xVel_Choices[i]*5, tribute_yVel_Choices[i]*5, distID+1);
    tributeArray.push(tributesObject);
  }
}

function draw()
{
  if(click==1)
  {
    if(millis()>eventChange)
    {
      gameBGM.play();
      gameBGM.loop();
      textFont(countdownFont);
      textSize(height);

      //generating initial countdown screen
      if(countdownScreen < countdownArray.length)
      {
        background(countdownColors[countdownScreen]);
          
        fill(255);
        strokeWeight(0);
        textAlign(CENTER,CENTER);
        text(countdownArray[countdownScreen], width/2.05, height/2.3);

        stroke(255,1);
        strokeWeight(1);
        for(let xPos_Line = 0; xPos_Line <=width; xPos_Line+=40)
        {
          for(let yPos_Line = 0; yPos_Line <=height; yPos_Line+=40)
          {
            line(xPos_Line, 0, xPos_Line, height);
            line(0, yPos_Line, width, yPos_Line);
          }
        }

        countdownScreen++;
      }
      
      //gameplay code
      else if(countdownScreen >= countdownArray.length)
      {
        imageMode(CENTER);
        image(gameMap, width/2, height/2, width*2, height*1.5);
        background(0,50,0,210);
        stroke(255,1);
        strokeWeight(1);
        for(let xPos_Line = 0; xPos_Line <=width; xPos_Line+=40)
        {
          for(let yPos_Line = 0; yPos_Line <=height; yPos_Line+=40)
          {
            line(xPos_Line, 0, xPos_Line, height);
            line(0, yPos_Line, width, yPos_Line);
          }
        }
        
        for(let i=0; i<tributeArray.length; i++)
        {
          let tributesObject = tributeArray[i];
          tributesObject.updateTributePos();
          tributesObject.tributeCreate();
        }
      }

      eventChange = millis()+timer;
      detectVictor();
    }
  }
}

//function to detect lone "Tribute" as Victor
function detectVictor()
{
  if(totalTributes==1)
  {
    fill(0,150);
    rect(0,0,width,height);

    for(let i=0; i<tributeArray.length; i++)
    {
      if(tributeArray[i].rad_Tribute!=0)
      {
        fill(255);
        noStroke();
        textAlign(CENTER,CENTER);

        fill(0,255,0);
        textSize(75);
        text("-| HUNGER GAMES |-", width/2, height/4);
        
        fill(255);
        textSize(32);
        text("WINNER: D"+tributeArray[i].districtID_Tribute, width/2, height/2);
      }
    }

    noLoop();
  }
}

function mouseClicked()
{
  click = 1;
}