import { Vector2 } from "../primitives/math";
import { p } from "../primitives/p5";
import rough from "roughjs";
import { handText } from "../primitives/textGenerator";
import { Block, BlockType, getNextOrder, selection } from "./block";
import { Task } from "./task";
import { createRoundedRectPath } from "../primitives/shapes";

export class Group extends Block {
  type = BlockType.Group;
  name: string = "A simple group";
  size: Vector2 = { x: 460, y: 110 };
  description: string = "";
  children: string[] = [];
  autoDecoration: string | null = null;

  static all: Group[] = [];

  constructor() {
    super();
    this.renderTexture();
  }

  draw() {
    p.push();
    p.image(this.texture, this.position.x, this.position.y);
    this.updateChildren();
    this.drawTitle();
    p.pop();
  }

  drawTitle() {
    p.textSize(18);
    p.textAlign(p.LEFT, p.TOP);
    handText(this.name, this.position.x + 26, this.position.y + 24);
  }

  updateChildren() {
    // TODO: This should be optimized to not run every tick!
    const selectedBlocks = selection.getState().blocks;

    for (const dragBlock of selectedBlocks) {
      if (
        dragBlock &&
        dragBlock.dragDistance > 5 &&
        dragBlock.inDrag &&
        dragBlock !== this
      ) {
        if (
          this.cursorInside() &&
          dragBlock.type == BlockType.Task &&
          !this.children.includes((dragBlock as Task).id)
        ) {
          this.children.push((dragBlock as Task).id);
          dragBlock.position = this.position;
          this.reorder();
        }

        if (
          this.children.includes((dragBlock as Task).id) &&
          !this.cursorInside()
        ) {
          this.children.splice(
            this.children.indexOf((dragBlock as Task).id),
            1
          );
        }
      }
    }

    let currentSize = 0;
    this.children
      .map((e) => Block.map.get(e)! as Task)
      .sort((a, b) => a.position.y - b.position.y)
      .forEach((task) => {
        if (!task || !Block.map.has(task.id)) return;
        if (!task.inDrag) {
          task.position = {
            x: this.position.x + 25,
            y: this.position.y + 60 + currentSize,
          };
          if (this.autoDecoration !== null) {
            task.decoration = this.autoDecoration;
          }
        }

        currentSize += task.size.y;
      });

    if (this.size.y !== currentSize + 80) {
      this.resize({ x: this.size.x, y: currentSize + 80 });
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
  }

  handleDragStart(): boolean | void {}

  handleMouseRelease(): void {}

  reorder(): void {
    this.order = getNextOrder();
    for (let childId of this.children) {
      const child = Block.map.get(childId);
      if (child) {
        child.order = getNextOrder();
      }
    }
  }
}
