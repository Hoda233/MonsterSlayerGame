//regular javascript function used only in app.js
function getRandomValue(min, max) {
  // reduce health by a random integer between min and max
  return Math.floor(Math.random() * (max - min) + min);
}

const app = Vue.createApp({
  data() {
    return {
      monsterHealth: 100,
      playerHealth: 100,
      currentRound: 0,
      winner: null,
      logMessages: [],
    };
  },

  computed: {
    monsterBarStyle() {
      //control the health not to be negative and make wrong style
      if (this.monsterHealth < 0) {
        return { width: "0%" };
      }
      return { width: this.monsterHealth + "%" };
    },

    playerBarStyle() {
      if (this.playerHealth < 0) {
        return { width: "0%" };
      }
      return { width: this.playerHealth + "%" };
    },

    after3Rounds() {
      return this.currentRound % 3 !== 0;
    },
  },

  watch: {
    playerHealth(value) {
      if (value <= 0 && this.monsterHealth <= 0) {
        //draw
        this.winner = "draw";
      } else if (value <= 0) {
        //player lost
        this.winner = "monster";
      }
    },
    monsterHealth(value) {
      if (value <= 0 && this.playerHealth <= 0) {
        //draw
        this.winner = "draw";
      } else if (value <= 0) {
        //monster lost
        this.winner = "player";
      }
    },
  },

  methods: {
    startNewGame() {
      //reset all data
      this.monsterHealth = 100;
      this.playerHealth = 100;
      this.currentRound = 0;
      this.winner = null;
      this.logMessages = [];
    },

    attackMonster() {
      //update round
      this.currentRound++;
      //get the random attack value
      const attackValue = getRandomValue(5, 12);
      //update monster's health
      this.monsterHealth -= attackValue;
      //add the log message
      this.addLogMessage("Player", "attack", attackValue);
      //attack the player back
      this.attackPlayer();
    },

    attackPlayer() {
      const attackValue = getRandomValue(8, 15);
      this.playerHealth -= attackValue;
      this.addLogMessage("Monster", "attack", attackValue);
    },

    specialAttackMonster() {
      this.currentRound++;
      const attackValue = getRandomValue(10, 25);
      this.monsterHealth -= attackValue;
      this.addLogMessage("Player", "special-attack", attackValue);
      this.attackPlayer();
    },

    healPlayer() {
      this.currentRound++;
      const healValue = getRandomValue(8, 20);
      //control the health not to exceed 100
      if (this.playerHealth + healValue < 100) {
        this.playerHealth += healValue;
      } else {
        this.playerHealth = 100;
      }
      this.addLogMessage("Player", "heal", healValue);
      this.attackPlayer();
    },

    surrender() {
      this.winner = "monster";
    },

    addLogMessage(who, what, value) {
      //using unshift built in function to push the message into the list from the beginning
      this.logMessages.unshift({
        actionBy: who,
        actionType: what,
        actionValue: value,
      });
    },
  },
});
app.mount("#game");
