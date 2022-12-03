import p5 from "p5";
import { addAssetRaw, assets } from "../primitives/assets";
import { Vector2 } from "../primitives/math";
import { p } from "../primitives/p5";
import { handText } from "../primitives/textGenerator";
import { Block, BlockType } from "./block";
export type TaskPriority = "S" | "M" | "L" | "XL";

export class ImageBlock extends Block {
	type = BlockType.Image;
	order: number = 2;
	size: Vector2 = { x: 400, y: 110 };

	imageData: string = "";

	constructor() {
		super();
	}

	draw() {
		p.push();
		this.drawSelection();
		if (assets.has(this.id)) {
			p.image(
				assets.get(this.id)!,
				this.position.x,
				this.position.y,
				this.size.x,
				this.size.y
			);
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

	onImageLoad(image: p5.Image) {
		this.size.x = image.width;
		this.size.y = image.height;
	}

	renderTexture(): void {}
	handleDragStart(): void {}
	handleMouseRelease(): void {}
}
