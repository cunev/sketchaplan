import p5 from "p5";
import { Key } from "ts-keycode-enum";
import create from "zustand";
import { Camera } from "../primitives/camera";
import { Vector2 } from "../primitives/math";
import { p } from "../primitives/p5";
import { v4 } from "uuid";

export const selectedBlock = create<{ block: Block | undefined }>(() => ({
	block: undefined,
}));

export enum BlockType {
	Task,
	Group,
	Text,
}

export abstract class Block {
	abstract type: BlockType;
	abstract order: number;
	abstract draw(): void;
	abstract renderTexture(): void;

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
		}
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

	mousePressed() {
		if (this.cursorInside()) {
			Block.all.forEach((block) => {
				block.inDrag = false;
			});
			selectedBlock.setState({ block: this });
			if (this.locked) {
				return;
			}
			this.inDrag = true;
			this.dragDeltaPosition = {
				x: this.position.x - Camera.mouseX,
				y: this.position.y - Camera.mouseY,
			};
			this.handleDragStart();
		}
	}

	mouseReleased() {
		this.inDrag = false;
	}

	drawSelection() {
		if (selectedBlock.getState().block == this) {
			p.push();
			p.noFill();
			p.stroke("#6965db");
			p.strokeWeight(1.4);
			p.drawingContext.setLineDash([10, 4]);
			p.rect(this.position.x, this.position.y, this.size.x, this.size.y);
			p.pop();
		}
	}
	abstract handleDragStart(): void;
	abstract handleMouseRelease(): void;
}
