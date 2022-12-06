import { Vector2 } from "../primitives/math";
import { p } from "../primitives/p5";
import { handText } from "../primitives/textGenerator";
import { Block, BlockType } from "./block";
export type TaskPriority = "S" | "M" | "L" | "XL";

export class TextBlock extends Block {
  type = BlockType.Text;
  order: number = 1;
  size: Vector2 = { x: 400, y: 110 };
  textSize = 48;
  color: string = "black";
  name: string = "Sample Text";

  constructor() {
    super();
  }

  draw() {
    p.push();
    p.textSize(this.textSize);
    p.textAlign(p.LEFT, p.TOP);
    const textData = handText(
      this.name,
      this.position.x + 4,
      this.position.y + 4,
      this.color
    );
    if (textData)
      this.resize({ x: textData.width + 8, y: textData.height + 12 });
    p.pop();
  }

  renderTexture(): void {}
  handleDragStart(): void {}
  handleMouseRelease(): void {}
  reorder(): void {
    this.order = Block.getNextOrder();
  }
}
