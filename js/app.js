'use strict';
// Intialize variables
let lives = 1;
let score = 0;
let maxHeight= 806;
let maxWidth = 705;
let gameWon=false;
let gameLost=false;

// Player position
let player_x = 100;
let player_y = 500;
let name = 'char-boy.png'
let player ={};

let allCollectables=[];
let allEnemies = [];

let gem__score = document.querySelectorAll('.gem__score .score');
let heartLeft = document.querySelectorAll('.heart__score .score');
let modal = document.querySelectorAll('.modal');
let close = document.querySelectorAll('.modal-content .close');
let characters = document.querySelector('.characters');
// set up initial position of bugs and gems
class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 80+ Math.floor(Math.random() * 210);
    this.sprite = 'images/enemy-bug.png';
  }

  // Update the enemy's position, required method for game
  // Parameter: dt, a time delta between ticks
  update(dt) {
    if (this.x < 700) {
      this.x = this.x + (dt * this.speed);
    } else {
      this.x = -100;
      this.speed = 80+ Math.floor(Math.random() * 210);
    }
  }
  // Draw the enemy on the screen, required method for game
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
}

class Collectables
{
  constructor(x, y,img,name) {
    this.x = x;
    this.y = y;
    this.sprite = 'images/'+img;
    this.name=name;
  }

  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y,68,110);
  }
}

class Player {
  constructor(x, y,name) {
    this.x = x;
    this.y = y;
    this.sprite = 'images/'+name;
  }
  update() {

    // Restart
    if(this.x<=-50)
    {
      this.x+=95;
    }
    else if (this.x>605) {
      this.x-=95;
    }
    else if (this.y>600)
    {
      this.y-=90;
    }
    else if (this.y<10)
    {
      this.y = player_y;
      this.x = player_x
      gameWon = true;
      gem__score[1].innerHTML=score;
      heartLeft[1].innerHTML=lives;
      reset();
      modal[1].classList.toggle('hide');
    }

    // collision: bounding box concept.
    // Source: https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
    for (let ene of allEnemies) {
      if (this.x <= ene.x + 74 && this.x + 40 >= ene.x && this.y < ene.y + 35 && this.y+30 > ene.y) {

        // lose 1 life when player collides with bug
        heartLeft[0].innerHTML=--lives;

        // reset position of player
        this.y = 500;
        this.x=100;
        // check if all lives are over,If yes then game is lost.
        if(lives<=-1){
          gameLost = 1;
          console.log('lives gone');
          modal[2].classList.toggle('hide');
        }
      }
    }

    // item collections
    for (let item of allCollectables) {
      // The player takes the gems/heart. Again using collision concept to collect item.
      if (this.x <= item.x + 20 && this.x + 40 >= item.x && this.y < item.y + 30  && this.y+90 >= item.y) {
        if(item.name === 'gem') {
            gem__score[0].innerHTML=++score;
        }
        else {
          heartLeft[0].innerHTML=++lives;
        }
        // remove gems/heart from canvas by positioning them outside of canvas
        item.x=maxWidth;
        item.y=maxHeight;
      }
    }
  }

  // Draw the enemy on the screen, required method for game
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
  handleInput(keyPressed) {
    if (keyPressed === 'left') {
      this.x -= 95;
    } else if (keyPressed === 'right') {
      this.x += 95;
    } else if (keyPressed === 'up') {
      this.y -= 90;
    } else if (keyPressed === 'down') {
      this.y += 90;
    }
  }
}

// This function initiallizes the positions of bugs and player on the game board
initialPos();

// This listens for key presses and sends the keys to your
// Player.handleInput() method.
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down'
  };
  player.handleInput(allowedKeys[e.keyCode]);
});

// choose characters
characters.addEventListener('click',function(){
  if (event.target.nodeName === 'IMG') {
     name = 'char-'+event.target.dataset.name+'.png';
     player = new Player(player_x, player_y,name);
     modal[0].classList.toggle('hide');
  }
});

// close modal and reset game
// 0 index --> character Modal
// 1 index --> win pop up modal
// 2 index --> game over pop up modal

close[0].addEventListener('click', function() {
  modal[0].classList.toggle('hide');
  reset();
});
close[1].addEventListener('click', function() {
  modal[1].classList.toggle('hide');
  reset();
});
close[2].addEventListener('click', function() {
  modal[2].classList.toggle('hide');
  reset();
});

// Reset game
function reset() {
   lives = 1;
   score = 0;
   gameWon=false;
   gameLost=false;
   initialPos();
   gem__score[0].innerHTML=score;
   heartLeft[0].innerHTML=lives;
}

//set initial position of player
function initialPos() {
  allCollectables=[];
  allEnemies = [];
  allCollectables.push(new Collectables(20,100,'Gem Blue.png','gem'));
  allCollectables.push(new Collectables(420,270,'Gem Blue.png','gem'));
  allCollectables.push(new Collectables(520,100,'Gem Green.png','gem'));
  allCollectables.push(new Collectables(520,430,'Gem Green.png','gem'));
  allCollectables.push(new Collectables(220,185,'Gem Orange.png','gem'));
  allCollectables.push(new Collectables(20,350,'Gem Orange.png','gem'));
  allCollectables.push(new Collectables(320,430,'Gem Blue.png','gem'));
  allCollectables.push( new Collectables(120,270,'Heart.png','heart'));
  allCollectables.push( new Collectables(420,185,'Heart.png','heart'));
  allEnemies.push(new Enemy(320, 55));
  allEnemies.push(new Enemy(320, 140));
  allEnemies.push(new Enemy(320, 230));
  allEnemies.push(new Enemy(-80, 390));
  allEnemies.push(new Enemy(-180, 140));
  allEnemies.push(new Enemy(-50, 300));
  allEnemies.push(new Enemy(-50, 230));
  player = new Player(player_x, player_y,name);
}
