import { Scene } from "phaser";
import storyFile from "../ink/vampiro.json";
import assets from "../assets/images/assets.png";
import assetsJSON from "../assets/assets.json";
import sounds from "../assets/sounds/*.mp3";

export default class Boot extends Scene {
  constructor() {
    super({ key: "boot" });
  }

  init() {
    this.fontsReady = false;
  }

  preload() {
    WebFont.load({
      google: {
        families: ["Roboto Mono"],
      },
      active: this.fontsLoaded,
    });

    var bar = this.add
      .rectangle(2048 / 2, 1536 / 2, 100, 8, 0x9c3333)
      .setScale(0, 0);

    this.load.on("progress", function (progress) {
      console.log(progress);
      bar.setScale(progress * 5, 1);
    });
    this.load.json("storyFile", storyFile);
    this.load.atlas("assets", assets, assetsJSON);

    this.load.audio("pickup", [sounds.pickup]);
  }

  create() {
    this.scene.start("game");
  }

  fontsLoaded() {
    this.fontsReady = true;
  }
}
