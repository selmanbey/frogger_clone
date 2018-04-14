/*****************************************************************************

                                    CLASSES

******************************************************************************/

// ENEMY CLASS to create the bugs (enemies) in the game
class Enemy {
  // Initiates an enemy object
  // Parameter: Lane, the lane enemy should appear
  constructor(lane) {
    this.sprite = 'images/enemy-bug.png'; // enemy's visual representation
    this.lane = lane; // the lane enemy appears and stays
    this.x = [0, 100, 200, 300, 400][(Math.round(Math.random() * 4))]; // initial spawn is random on the x axis
    this.y = [140, 220, 300, 380][this.lane]; // initial spawn is according to enemy's lane
    this.vel = [80, 100, 160, 200, 250][(Math.round(Math.random() * 4))]; // the velocity (speed) of enemy (random)
    this.width = 95; // enemy object's width
    this.height = 65; // enemy object's height
    this.imageDX = 0; // shifts image on the X axis to optimize visual representation with the game logic
    this.imageDY = -80; // shifts image on the Y axis to optimize visual representation with the game logic
  };

  // Updates the enemy's position
  // Parameter: dt, a time delta between ticks
  update(dt) {
    // if the enemy is within the game screen, it moves on its lane
    if (this.x < 510) {
      this.x += this.vel * dt;
    // if the enemy leaves screen, it spawns from start with a new random velocity
    } else {
      this.x = [-100, -200, -300][(Math.round(Math.random() * 2))];
      this.vel = [100, 160, 200, 250, 300][(Math.round(Math.random() * 4))];
    }
  };

  // Draws the enemy on the screen
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x + this.imageDX, this.y + this.imageDY);
  };
};


// PLAYER CLASS to create the player in the game
class Player {
  // Initiates the player object
  // Parameters: Sprite, the visual representation of the player
  //             allEnemies, an enemy array that contains player's enemies
  constructor(sprite, allEnemies) {
    this.sprite = sprite; // player's visual representation
    this.initialX = 210; // player's initial position on the x axis
    this.initialY = 470; // player's initial position on the y axis
    this.x = this.initialX; // player's position on the x axis (initially initialX)
    this.y = this.initialY; // player's position on the x axis (initially initialY)
    this.dX = 100; // player's one step on the x axis (left or right)
    this.dY = 80; // player's one step on the y axis (up or down)
    this.enemyList = allEnemies; // player's enemies
    this.width = 80; // player object's width
    this.height = 70; // player object's width
    this.imageDX = -5; // shifts player's image on the X axis to optimize visual representation with the game logic
    this.imageDY = -90; // shifts player's image on the X axis to optimize visual representation with the game logic
  }

  // Moves the player on either X or Y axis
  // Limits his/her movement to game screen
  move(dX, dY) {
    if (this.x + dX >= 0 && this.x + dX < 500) {
      this.x += dX;
    }
    if (this.y + dY <= 470 && this.y + dY > 0) {
      this.y += dY;
    }
  }

  // Checks if player touches an enemy
  // If it does: (1) Sends player to his/her initial spot
  //             (2) Restarts level
  //             (3) Opens a modal box informing user about the collusion
  checkCollisionWithEnemies() {
    for (let enemy of this.enemyList) {
      if (this.x < enemy.x + enemy.width &&
          this.x + this.width > enemy.x &&
          this.y < enemy.y + enemy.height &&
          this.y + this.height > enemy.y) {
        this.x = this.initialX;
        this.y = this.initialY;
        levelTable.level = 0;
        enemyCollusionBox.showModal()
      }
    }
  }

  // Checks if player reaches an award
  // If it does: (1) Runs reward.update() method to update the reward's status
  //             (2) Adds a level and updates high score
  //             (3) Opens a modal box informing user about the reward acquisiton
  //             (4) Sends player to his/her initial spot
  checkCollisionWithRewards() {
    if (this.x < reward.x + reward.width &&
        this.x + this.width > reward.x &&
        this.y < reward.y + reward.height &&
        this.y + this.height > reward.y) {
          reward.update();
          rewardCollusionBox.showModal();
          levelTable.level += 1;
          if (levelTable.level > bestSoFarTable.level) {
            bestSoFarTable.level = levelTable.level
            localStorage.setItem("highScore", bestSoFarTable.level)
          }
          player.x = player.initialX;
          player.y = player.initialY;
      }
  }

  // Updates the players state by constantly checking for collusions
  update() {
    this.checkCollisionWithEnemies();
    this.checkCollisionWithRewards();
  }

  // Draws the player on the screen
  render(){
    let image = new Image();
    image.src = this.sprite;
    ctx.drawImage(image, this.x + this.imageDX, this.y + this.imageDY, image.width, image.height);
  }

  // Moves the user according to user input handling data sent from document's keyup event listener
  // Closes modal boxes if any is open
  handleInput(key){
    if (enemyCollusionBox.open) {
      enemyCollusionBox.close();
    }
    if (rewardCollusionBox.open) {
      rewardCollusionBox.close();
    }
    switch (key) {
      case "up":
        this.move(0, -this.dY);
        break;
      case "down":
        this.move(0, this.dY);
        break;
      case "left":
        this.move(-this.dX, 0);
        break;
      case "right":
        this.move(this.dX, 0);
        break;
      }
  }
}

// REWARD CLASS to create the gems (rewards) in the game
class Reward {
  // Initiates the reward object
  constructor(){
    this.sprites = [
      "images/Gem Orange.png",
      "images/Gem Blue.png",
    ] // two possible visual representations for the reward
    this.sprite = this.sprites[0] // initial reward representation (orange)
    this.x = 215; // reward's position on the x axis
    this.y = 55; // reward's position on the x axis
    this.imageDX = 0; // shifts reward's image on the X axis to optimize visual representation with the game logic
    this.imageDY = -36; // shifts reward's image on the Y axis to optimize visual representation with the game logic
    this.width = 70; // reward's width
    this.height = 70; // reward's height
  }

  // Spawns the reward again in another random position once its collected
  // Changes its color (to imporve UX: in case it spawns in the same place, the user can still see it is a different reward)
  update() {
      this.x = [15, 115, 215, 315, 415][(Math.round(Math.random() * 4))];
      this.sprite = this.sprites[this.sprite == this.sprites[0] ? 1 : 0]
  }


  // Draws the reward on the game screen
  render() {
    let image = new Image();
    image.src = this.sprite;
    image.width = 70;
    image.height = 110;
    ctx.drawImage(image, this.x + this.imageDX, this.y + this.imageDY, image.width, image.height);
  }
}


// TABLE CLASS to create score boards in the game
class Table {
  // Initiates the score board
  constructor(text, x, y, color, fontsize) {
    this.level = 0 // the score to be displayed (initially 0)
    this.text = text; // the explanation to be displayed before the score
    this.x = x; // score board's position on the x axis
    this.y = y; // score board's position on the y axis
  }

  // Updates the score board during the game
  update () {
    ctx.fillStyle = '#D4AC0D'
    ctx.font = '36px Black Han Sans, sans-serif';
    ctx.fillText(this.text + `${this.level}`, this.x, this.y);
    ctx.strokeText(this.text + `${this.level}`, this.x, this.y);
  }

  // Draws the score board on game screen
  render () {
    ctx.fillStyle = '#D4AC0D'
    ctx.font = '36px Black Han Sans, sans-serif';
    ctx.fillText(this.text + `${this.level}`, this.x, this.y);
    ctx.strokeText(this.text + `${this.level}`, this.x, this.y);
  }
}


/*****************************************************************************

                          GAME OBJECTS & VARIABLES

******************************************************************************/


// MODAL BOXES
const enemyCollusionBox = document.querySelector(".collusion-with-enemy");
const rewardCollusionBox = document.querySelector(".collusion-with-reward");
const selectCharBox = document.querySelector(".select-char");

// CHARACTER SELECTION BUTTONS
const charImages = document.querySelectorAll(".char-img");

// INSTANTIATION OF ENEMIES
const allEnemies = new Array()

let lane = 0;
for (let i = 0; i < 4; i++) {

  if (lane < 5) {
    const enemy = new Enemy(lane);
    allEnemies.push(enemy);
    lane += 1;
  } else {
    lane = 0;
  }
}

// INSTANTIATION OF THE PLAYER
const player = new Player("images/char-horn-girl.png", allEnemies)

// INSTANTIATION OF THE FIRST REWARD
const reward = new Reward()

// INSTANTIATION OF THE LEVEL TABLES
const levelTable = new Table("Level: ", 10, 50)
const bestSoFarTable = new Table("Best So Far: ", 220, 50)

// SETTING HIGH SCORE
// Uses localStorage to save the highest score in user's local machine
let highScore = localStorage.getItem("highScore")
if (highScore == null) {
  localStorage.setItem("highScore", bestSoFarTable.level)
} else {
  bestSoFarTable.level = highScore
}


/*****************************************************************************

                              EVENT LISTENERS

******************************************************************************/


/* Listens for key presses and sends the keys to the
 Player.handleInput() method */
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

/* Listens for character selection buttons and sets the character
image for the player. Closes the modal box afterwards */
for (let char of charImages) {
  char.addEventListener("click", function(e) {
    if (this.tagName == "IMG") {
      player.sprite = this.src;
      player.render();
      selectCharBox.close();
    }
  })
}
