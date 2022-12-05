import p5 from "p5";
import { Key } from "ts-keycode-enum";
import create from "zustand";
import { Camera } from "../primitives/camera";
import { Vector2 } from "../primitives/math";
import { p } from "../primitives/p5";
import { v4 } from "uuid";

export const selection = create<{ blocks: Block[] }>(() => ({
  blocks: [],
}));

export enum BlockType {
  Task,
  Group,
  Text,
  Image,
}

export abstract class Block {
  abstract type: BlockType;
  abstract order: number;
  abstract draw(): void;
  abstract renderTexture(): void;
  private lastPosition: Vector2 = { x: 0, y: 0 };

  dragDistance: number = 0;
  size: Vector2 = { x: 0, y: 0 };
  position: Vector2 = {
    x: -Camera.position.x - 200,
    y: -Camera.position.y - p.windowHeight / 2 + 100,
  };

  id: string = v4();
  texture: p5.Graphics = p.createGraphics(0, 0);
  locked: boolean = false;
  inDrag = false;
  dragDeltaPosition: Vector2 = { x: 0, y: 0 };
  isSelected: boolean = false;

  static all: Block[] = [];
  static map: Map<string, Block> = new Map<string, Block>();
  constructor() {
    Block.all.push(this);
    Block.map.set(this.id, this);
  }

  update() {
    if (this.inDrag) {
      this.position = {
        x: Camera.mouseX + this.dragDeltaPosition.x,
        y: Camera.mouseY + this.dragDeltaPosition.y,
      };
      this.dragDistance += p.dist(
        this.position.x,
        this.position.y,
        this.lastPosition.x,
        this.lastPosition.y
      );
      this.lastPosition = {
        x: this.position.x,
        y: this.position.y,
      };
    }
    this.drawSelection();
    this.draw();
  }

  cursorInside() {
    return (
      Camera.mouseX > this.position.x &&
      Camera.mouseX < this.position.x + this.size.x &&
      Camera.mouseY > this.position.y &&
      Camera.mouseY < this.position.y + this.size.y
    );
  }

  resize(size: Vector2) {
    this.size = size;
    this.renderTexture();
  }

  mousePressed(selectionInfluence: boolean) {
    if (this.cursorInside() || selectionInfluence) {
      if (this.locked) {
        return true;
      }
      if (this.handleDragStart()) {
        return true;
      }
      this.inDrag = true;
      this.dragDistance = 0;
      this.lastPosition = {
        x: this.position.x,
        y: this.position.y,
      };
      this.dragDeltaPosition = {
        x: this.position.x - Camera.mouseX,
        y: this.position.y - Camera.mouseY,
      };
      return true;
    }
  }

  mouseReleased() {
    this.inDrag = false;
    this.handleMouseRelease();
  }

  drawSelection() {
    if (selection.getState().blocks.includes(this)) {
      this.isSelected = true;
      p.push();
      p.noFill();
      p.stroke("#6965db");
      p.strokeWeight(1.4);
      p.drawingContext.setLineDash([10, 4]);
      p.rect(this.position.x, this.position.y, this.size.x, this.size.y);
      p.pop();
    } else {
      this.isSelected = false;
    }
  }

  abstract handleDragStart(): boolean | void;
  abstract handleMouseRelease(): void;
}
