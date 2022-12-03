import { Vector2 } from "./math";
import { p } from "./p5";

export class Camera {
	static position: Vector2 = { x: 0, y: 0 };
	static scale = 1;
	private static acceleration: Vector2 = { x: 0, y: 0 };
	private static startPos: Vector2 = { x: 0, y: 0 };
	private static deltaPos: Vector2 = { x: 0, y: 0 };
	private static inDrag: boolean = false;

	static update() {
		if (this.inDrag) {
			p.cursor("grab");
			this.position = {
				x:
					this.startPos.x +
					(p.mouseX - Camera.deltaPos.x) / this.scale,
				y:
					this.startPos.y +
					(p.mouseY - Camera.deltaPos.y) / this.scale,
			};
		}
		p.translate(p.windowWidth / 2, p.windowHeight / 2);
		p.scale(Camera.scale);
		p.translate(Camera.position.x, Camera.position.y);
	}

	static get mouseX() {
		return (
			p.mouseX / this.scale -
			p.windowWidth / 2 / this.scale -
			Camera.position.x
		);
	}

	static get mouseY() {
		return (
			p.mouseY / this.scale -
			p.windowHeight / 2 / this.scale -
			Camera.position.y
		);
	}

	static startDeltaPos() {
		Camera.inDrag = true;
		Camera.startPos = { x: Camera.position.x, y: Camera.position.y };
		Camera.deltaPos.x = p.mouseX;
		Camera.deltaPos.y = p.mouseY;
	}

	static endDeltaPos() {
		this.inDrag = false;
	}

	static translateXBy(delta: number) {
		Camera.acceleration.x += delta / this.scale;
	}

	static translateYBy(delta: number) {
		Camera.acceleration.y += delta / this.scale;
	}
}
