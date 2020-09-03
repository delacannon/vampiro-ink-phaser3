import { Scene, Actions } from "phaser";
import { Story } from "inkjs";

export default class Game extends Scene {
  constructor() {
    super({ key: "game" });
  }

  init() {
    const storyFile = this.game.cache.json.get("storyFile");
    this.story = new Story(storyFile);
  }

  create() {
    this.createGUI();
    this.createExternals();
    this.continueStory();
  }

  createExternals() {
    this.story.BindExternalFunction("show_image_bg", (key) => {
      if (this.roomImage.frame.name !== `${key}.png`) {
        this.roomImage.setAlpha(0);
        this.roomImage.setTexture("assets", `${key}.png`);
        this.tweens.add({
          targets: this.roomImage,
          alpha: 1,
          ease: "Power1",
          duration: 300,
        });
      }
    });
    this.story.BindExternalFunction("change_inventory_state", (key, change) => {
      console.log("change-inventory-state");
    });
    this.story.BindExternalFunction("hide_image", () => {
      this.itemImage.setAlpha(0);
      this.itemImage.setTexture("assets", ``);
    });
    this.story.BindExternalFunction("add_to_inventory", (item, state) => {
      // Elements
      console.log(item, state, "mmm");
    });
    this.story.BindExternalFunction("pickup", () => {
      // Elements
      console.log("m");
    });
    this.story.BindExternalFunction("show_image", (item) => {
      this.itemImage.setAlpha(0);
      this.itemImage.setTexture("assets", `${item}.png`);
      this.tweens.add({
        targets: this.itemImage,
        alpha: 1,
        ease: "Power1",
        duration: 300,
      });
    });
    this.story.BindExternalFunction("snd_fx", () => {
      console.log("snd_fx");
    });
  }

  setGameVariable(txt, newValue) {
    this.story.variablesState._globalVariables.set(txt, newValue);
  }

  getGameVariable(txt) {
    return this.story.variablesState._globalVariables.get(txt).value;
  }

  continueStory(jump) {
    let text = "";
    let storyFragment = {};

    if (jump !== undefined) {
      this.story.ChoosePathString(jump);
      this.choicesGroup.clear(true, true);
      return false;
    }

    while (this.story.canContinue) {
      let paragraphText = this.story.Continue();

      text += `${paragraphText}\n`;
      this.textRoom.text = this.getGameVariable("current_name");

      if (!this.story.canContinue) {
        storyFragment = {
          choices: this.story.currentChoices,
          tags: this.story.currentTags,
          text: text.trim(),
        };
        this.createParagraphText({ ...storyFragment });
      }
    }
  }

  createParagraphText({ text, choices, tags }) {
    this.textParagraph.text = text;
    this.addChoices(choices);
  }

  addChoices(choices) {
    const choiceTextStyle = {
      fontSize: 40,
      fontFamily: "Roboto Mono",
      fill: "#9c3333",
      wordWrap: true,
      wordWrapWidth: this.wordWrapWidth,
      align: "center",
    };

    for (let choice of choices) {
      let bgChoice = this.add.image(0, 0, "assets", "bg_choice.png");
      let choiceText = this.add
        .text(0, 0, choice.text, choiceTextStyle)
        .setOrigin(0.5);
      let choiceContainer = this.add
        .container(1400, 2000, [bgChoice, choiceText])
        .setAlpha(0)
        .setSize(bgChoice.width, bgChoice.height)
        .setInteractive();
      this.tweens.add({
        targets: choiceContainer,
        y: 768 + choice.index * bgChoice.height * 1.32,
        alpha: 1,
        ease: "Power1",
        duration: 600,
      });
      choiceContainer.on("pointerover", (pointer) => {
        choiceContainer.list[1].setFill("#ffffff");
      });
      choiceContainer.on("pointerout", (pointer) => {
        choiceContainer.list[1].setFill("#9c3333");
      });
      choiceContainer.on("pointerdown", (pointer) => {
        this.story.ChooseChoiceIndex(choice.index);
        this.choicesGroup.clear(true, true);
        this.continueStory();
      });
      this.choicesGroup.add(choiceContainer);
    }
  }

  createGUI() {
    this.wordWrapWidth = 1200;
    // add choices group
    this.choicesGroup = this.add.group();
    // add background image
    this.add.image(0, 0, "assets", "bg_pergamino.png").setOrigin(0, 0);
    // add inventory grid
    this.inventoryGroup = this.add.group();

    for (var i = 0; i < 9; i++) {
      let dummy = this.add
        .image(0, 0, "assets", "dummy_thumb.png")
        .setInteractive();
      this.inventoryGroup.add(dummy);
    }

    this.inventoryGroup.getChildren().forEach((prop) => {
      prop.on("pointerdown", (pointer) => {
        console.log({ prop });
      });
    });

    Actions.GridAlign(this.inventoryGroup.getChildren(), {
      width: 3,
      height: 3,
      cellWidth: 192,
      cellHeight: 192,
      x: 220,
      y: 960,
    });

    // Init empty text placeholders
    const paragraphStyle = {
      fontSize: 38,
      fontFamily: "Roboto Mono",
      fill: "#fff",
      wordWrap: true,
      wordWrap: { width: this.wordWrapWidth },
      align: "left",
    };

    const roomTextStyle = {
      fontSize: 40,
      fontFamily: "Roboto Mono",
      fill: "#9c3333",
      wordWrap: true,
      wordWrap: { width: this.wordWrapWidth },
      align: "center",
    };

    const labelInventoryStyle = {
      fontSize: 32,
      fontFamily: "Roboto Mono",
      fill: "#fff",
      wordWrap: true,
      wordWrap: { width: this.wordWrapWidth },
      align: "center",
    };

    // story paragraph
    this.textParagraph = this.add.text(778, 128, "", paragraphStyle);
    // text room on top left
    this.textRoom = this.add.text(390, 66, "", roomTextStyle).setOrigin(0.5);
    // text label inventary
    this.textLabelInventory = this.add.text(96, 1452, "", labelInventoryStyle);
    // Init placeholder images
    this.roomImage = this.add.image(400, 432, "").setOrigin(0.5).setAlpha(0);
    this.itemImage = this.add.image(400, 432, "").setOrigin(0.5).setAlpha(0);
    // Init placeholder sounds
  }
}
