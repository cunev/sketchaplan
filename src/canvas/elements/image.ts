import p5 from "p5";
import { addAssetRaw, assets } from "../primitives/assets";
import { Camera } from "../primitives/camera";
import { Vector2 } from "../primitives/math";
import { p } from "../primitives/p5";
import { handText } from "../primitives/textGenerator";
import { Block, BlockType, getNextOrder } from "./block";
export type TaskPriority = "S" | "M" | "L" | "XL";

export class ImageBlock extends Block {
  type = BlockType.Image;
  order: number = 2;
  ratio: number = 1;
  scale: number = 1;
  size: Vector2 = { x: 0, y: 0 };
  imageData: string = "";

  isResizing: boolean = false;

  constructor() {
    super();
  }

  draw() {
    p.push();
    if (this.isResizing) {
      this.size.x = Camera.mouseX - this.position.x;
      this.size.y = this.size.x / this.ratio;
    }
    if (assets.has(this.id)) {
      p.smooth();
      p.image(
        assets.get(this.id)!,
        this.position.x,
        this.position.y,
        this.size.x,
        this.size.y
      );
      p.noSmooth();
      this.drawScaleButton();
    } else if (this.imageData) {
      this.attachFile(this.imageData);
    }
    p.pop();
  }

  attachFile(base64: string) {
    this.imageData = base64;
    const image = p.loadImage(base64, (img) => {
      this.onImageLoad(img);
    });
    addAssetRaw(this.id, image);
  }

  drawScaleButton() {
    if (!this.isSelected) return;
    p.push();
    p.noStroke();
    p.fill("#6965db");
    p.triangle(
      this.position.x + this.size.x,
      this.position.y + this.size.y - 15,
      this.position.x + this.size.x,
      this.position.y + this.size.y,
      this.position.x + this.size.x - 15,
      this.position.y + this.size.y
    );
    if (
      this.cursorInside() &&
      p.dist(
        this.position.x + this.size.x,
        this.position.y + this.size.y,
        Camera.mouseX,
        Camera.mouseY
      ) < 15
    ) {
      p.cursor("nwse-resize");
    }
    p.pop();
  }

  onImageLoad(image: p5.Image) {
    this.ratio = image.width / image.height;
    if (!this.size.x && !this.size.y) {
      this.size.x = image.width;
      this.size.y = image.height;
    }
  }

  renderTexture(): void {}
  handleDragStart(): boolean | undefined {
    if (
      this.cursorInside() &&
      p.dist(
        this.position.x + this.size.x,
        this.position.y + this.size.y,
        Camera.mouseX,
        Camera.mouseY
      ) < 15
    ) {
      this.isResizing = true;
      return true;
    }
  }
  handleMouseRelease(): void {
    this.isResizing = false;
  }
  reorder(): void {
    this.order = getNextOrder();
  }
}
