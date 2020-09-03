import { Scene } from "phaser";
import storyFile from "../ink/vampiro.json";
import assets from "../assets/images/assets.png";
import assetsJSON from "../assets/assets.json";

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

    var bg = this.add.rectangle(2048 / 2, 1536 / 2, 2048, 4, 0x9c3333);
    var bar = this.add
      .rectangle(bg.x, bg.y, bg.width, bg.height, 0x9c3333)
      .setScale(0, 0);

    this.load.on("progress", function (progress) {
      if (progress >= 100) {
        this.fontsReady = true;
      }
      bar.setScale(progress, 1);
    });
    this.load.json("storyFile", storyFile);
    this.load.atlas("assets", assets, assetsJSON);
  }

  create() {
    this.scene.start("game");
  }

  fontsLoaded() {
    this.fontsReady = true;
  }
}
