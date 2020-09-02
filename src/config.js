import Phaser from "phaser";
import BootScene from "./scenes/Boot";
import GameScene from "./scenes/Game";

export default {
  type: Phaser.AUTO,
  width: 2048,
  height: 1536,
  backgroundColor: "#000000",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },

  title: "Vampiro Ink Phaser3",
  url: "no-link",
  scene: [BootScene, GameScene], //[BootScene, PlayScene],
};
