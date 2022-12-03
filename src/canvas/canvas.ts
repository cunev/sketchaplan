import p5, { File } from "p5";
import { Block, selectedBlock } from "./elements/block";
import { addAsset } from "./primitives/assets";
import { Camera } from "./primitives/camera";
import { p, setP } from "./primitives/p5";
import { loadCanvas, redo, saveCanvas, undo } from "./primitives/serialize";
import { setVirgilFont } from "./primitives/virgil";
import Stats from "stats.js";

export const _app = new p5((p5Instance) => {
	setP(p5Instance);

	p.preload = function preload() {
		setVirgilFont(this.loadFont("Virgil.ttf"));
		addAsset("checked.png");
		addAsset("canceled.png");
	};
	var stats = new Stats();
	stats.showPanel(0);

	p.setup = function setup() {
		const canvas = p.createCanvas(this.windowWidth, this.windowHeight);
		canvas.drop(handleDrop);
		canvas.parent(document.body);
		p.frameRate(120);
		loadCanvas();
		this.noSmooth();
		selectedBlock.subscribe(() => {
			saveCanvas();
		});
	};
	p.windowResized = function windowResized() {
		this.resizeCanvas(this.windowWidth, this.windowHeight);
	};
	p.draw = function draw() {
		stats.begin();
		p.cursor(p.ARROW);
		p.background(255);
		Camera.update();

		Block.all
			.sort((a, b) => a.order - b.order)
			.forEach((block) => block.update());

		stats.end();
	};
	p.mousePressed = (event: MouseEvent) => {
		if ((event.target as HTMLDivElement).id != "defaultCanvas0") return;

		if (event.button == 1) {
			Camera.startDeltaPos();
			return;
		}
		selectedBlock.setState({ block: undefined });
		Block.all.forEach((task) => task.mousePressed());
	};
	p.mouseReleased = () => {
		Camera.endDeltaPos();
		Block.all.forEach((task) => task.mouseReleased());
		saveCanvas();
	};
	p.mouseWheel = (event: WheelEvent) => {
		if (event.altKey) {
			Camera.scale *= event.deltaY > 0 ? 0.9 : 1.1;
			Camera.scale = p.constrain(Camera.scale, 0.2, 1);
			return;
		}
		Camera.position.x -= event.deltaX;
		Camera.position.y -= event.deltaY;
	};
	p.keyPressed = (event: KeyboardEvent) => {
		event.stopImmediatePropagation();
		if (
			event.code === "KeyZ" &&
			(event.ctrlKey || event.metaKey) &&
			event.shiftKey
		) {
			redo();
			return;
		} else if (event.code === "KeyZ" && (event.ctrlKey || event.metaKey)) {
			undo();
			return;
		}
		if (event.ctrlKey || event.metaKey || event.shiftKey) return;
		if (event.code == "Backspace" && event.target == document.body) {
			const currentSelected = selectedBlock.getState().block;
			if (currentSelected) {
				const currentIndex = Block.all.indexOf(currentSelected);
				Block.all.splice(currentIndex, 1);
			}
		}
		saveCanvas();
	};
	function handleDrop(file: File) {}
});
