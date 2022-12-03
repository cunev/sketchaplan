import { Block, BlockType } from "../elements/block";
import { Group } from "../elements/group";
import { Task } from "../elements/task";
import { TextBlock } from "../elements/text";
import { defaultCanvas } from "./defaultCanvas";

let canvasPointer = 0;
const previousCanvases: string[] = [];

export function undo() {
	if (!previousCanvases[canvasPointer]) return;
	if (canvasPointer == previousCanvases.length - 1) {
		canvasPointer -= 1;
	}
	loadCanvas(previousCanvases[canvasPointer]);
	canvasPointer -= 1;
}

export function redo() {
	if (!previousCanvases[canvasPointer + 1]) return;
	if (canvasPointer == -1) {
		canvasPointer += 1;
	}
	canvasPointer += 1;

	loadCanvas(previousCanvases[canvasPointer]);
}

export function saveCanvas() {
	const serialized = JSON.stringify(Block.all, (key, value) => {
		if (key == "texture") {
			return;
		}

		return value;
	});
	if (serialized == previousCanvases[previousCanvases.length - 1]) return;
	localStorage.setItem("canvas", serialized);
	previousCanvases.splice(canvasPointer + 1);
	previousCanvases.push(serialized);
	canvasPointer = previousCanvases.length - 1;
}

export function loadCanvas(canvas?: string) {
	if (!canvas) {
		canvas = localStorage.getItem("canvas")!;
		if (!canvas) {
			canvas = defaultCanvas;
		}
	}
	if (canvas) {
		localStorage.setItem("canvas", canvas);
		const loadedData: Block[] = JSON.parse(canvas);
		Block.all = [];
		Block.map = new Map<string, Block>();
		for (const block of loadedData) {
			let createdBlock: Block;
			switch (block.type) {
				case BlockType.Task:
					createdBlock = new Task();
					break;
				case BlockType.Group:
					createdBlock = new Group();
					break;
				case BlockType.Text:
					createdBlock = new TextBlock();
					break;
			}
			for (const entry of Object.entries(block)) {
				(createdBlock! as any)[entry[0]] = entry[1];
			}
			Block.map = new Map<string, Block>();
			Block.all.forEach((block) => {
				Block.map.set(block.id, block);
				block.resize(block.size);
			});
		}
	}
}
