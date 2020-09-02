import { Game } from "phaser";
import config from "./config.js";

function newGame() {
  if (game) return;
  game = new Game(config);
}

function destroyGame() {
  if (!game) return;
  game.destroy(true);
  game.runDestroy();
  game = null;
}

let game;

if (module.hot) {
  module.hot.dispose(destroyGame);
  module.hot.accept(newGame);
}

if (!game) newGame();
