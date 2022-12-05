import p5 from "p5";
import rough from "roughjs";
import { Vector2 } from "../primitives/math";
import { p } from "../primitives/p5";
import { handText } from "../primitives/textGenerator";
import { Block, BlockType } from "./block";
import { assets } from "../primitives/assets";
import { createRoundedRectPath } from "../primitives/shapes";

export type TaskPriority = "S" | "M" | "L" | "XL";

export class Task extends Block {
  type = BlockType.Task;
  order: number = 1;
  size: Vector2 = { x: 400, y: 110 };
  name: string = "A simple task";
  description: string = "";
  decoration: string = "";
  priority: TaskPriority = "S";

  static all: Task[] = [];
  static tagImages: Record<TaskPriority, p5.Graphics>;

  constructor() {
    super();
    Task.all.push(this);
    this.renderTexture();
  }

  draw() {
    p.push();
    p.image(this.texture, this.position.x, this.position.y);
    this.drawDecoration();
    this.drawTitle();
    this.drawDescription();
    this.drawTags();
    p.pop();
  }

  drawTitle() {
    p.textSize(18);
    p.textAlign(p.LEFT, p.TOP);
    handText(this.name, this.position.x + 26, this.position.y + 24);
  }

  drawDescription() {
    if (!this.description.length) return;
    p.textSize(15);
    handText(
      this.description,
      this.position.x + 26,
      this.position.y + 50,
      "rgb(70,70,70)"
    );
    p.translate(0, 20);
  }

  drawDecoration() {
    if (!(this.decoration.length && assets.has(this.decoration))) return;

    p.image(
      assets.get(this.decoration)!,
      this.position.x + this.size.x - 44,
      this.position.y + 20
    );
  }

  drawTags() {
    p.image(
      Task.tagImages[this.priority],
      this.position.x + 22,
      this.position.y + 55
    );
    p.fill("white");
    p.imageMode(p.CENTER);
    p.textSize(18);
    handText(
      this.priority,
      this.position.x + 22 + Task.tagImages[this.priority].width / 2,
      this.position.y + 53 + Task.tagImages[this.priority].height / 2
    );
  }

  setDescription(description: string) {
    this.description = description;
    if (description.length) {
      if (this.size.y == 110) this.resize({ x: this.size.x, y: 130 });
    } else {
      this.resize({ x: this.size.x, y: 110 });
    }
  }

  renderTexture(): void {
    this.texture.push();
    this.texture.clear(0, 0, 0, 0);
    this.texture.resizeCanvas(this.size.x, this.size.y);
    const rc = rough.canvas(this.texture.elt);
    this.texture.translate(5, 5);
    rc.path(createRoundedRectPath(this.size.x - 10, this.size.y - 10, 20), {
      roughness: 1.8,
      strokeWidth: 1.5,
      preserveVertices: true,
      bowing: 0.2,
      fill: "white",
      fillStyle: "solid",
    });
    this.texture.remove();
    this.texture.pop();
    if (!Task.tagImages) this.renderTaskImages();
  }

  renderTaskImages() {
    Task.tagImages = {
      S: p.createGraphics(80, 36),
      M: p.createGraphics(80, 36),
      L: p.createGraphics(80, 36),
      XL: p.createGraphics(80, 36),
    };

    for (const priorityRaw in Task.tagImages) {
      const priority = priorityRaw as TaskPriority;
      const tagImage = Task.tagImages[priority];
      const rc = rough.canvas(tagImage.elt);
      tagImage.translate(5, 5);
      let fill = "#fff";

      switch (priority) {
        case "S":
          fill = "#82c91e";
          break;
        case "M":
          fill = "#fab005";
          break;
        case "L":
          fill = "#fa5252";
          break;
        case "XL":
          fill = "#7950f2";
          break;
      }

      tagImage.remove();

      rc.path(createRoundedRectPath(70, 26, 10), {
        roughness: 1,
        strokeWidth: 1.5,
        preserveVertices: true,
        bowing: 0.2,
        fill,
        fillStyle: "cross-hatch",
        hachureGap: 6,
      });
    }
  }

  handleDragStart(): void {}

  handleMouseRelease(): void {}
}
