import { Scene } from "phaser";
import storyFile from "../ink/vampiro.json";
import imagesJPG from "../assets/images/*.jpg";
import imagesPNG from "../assets/images/*.png";

export default class Boot extends Scene {
  constructor() {
    super({ key: "boot" });
  }

  preload() {
    WebFont.load({
      google: {
        families: ["Roboto Mono"],
      },
    });

    var bg = this.add.rectangle(2048 / 2, 1536 / 2, 2048, 4, 0x9c3333);
    var bar = this.add
      .rectangle(bg.x, bg.y, bg.width, bg.height, 0x9c3333)
      .setScale(0, 1);

    this.load.on("progress", function (progress) {
      bar.setScale(progress, 1);
    });
    this.load.json("storyFile", storyFile);
    this.load.image("bg", imagesJPG.bg_pergamino);
    this.load.image("bg_choice", imagesPNG.bg_choice);
    this.load.image("dummy", imagesPNG.dummy_thumb);
  }

  create() {
    this.scene.start("game");
  }
}
