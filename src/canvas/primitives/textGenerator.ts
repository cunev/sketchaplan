import p5 from "p5";
import { p } from "./p5";
import { virgilFont } from "./virgil";

const textCache: Record<
	string,
	Record<
		number,
		{ image: p5.Graphics; width: number; height: number; color: string }
	>
> = {};

/*
From my tests - 
Canvas is really bad at drawing custom fonts.

To prevent it from generating the text graphics every tick, I'm caching the
text inside a Offscreen Canvas and render it whenever I need.

TLDR. Text rendering optimization using cached images
*/

const isEmoji = (char: string) => {
	const reg =
		/[\p{Extended_Pictographic}\u{1F3FB}-\u{1F3FF}\u{1F9B0}-\u{1F9B3}]/u;
	return reg.test(char);
};
export function handText(text: string, x: number, y: number, fill?: string) {
	p.push();
	p.textFont(virgilFont);
	let width = 0;
	let height = 0;
	let maxWidth = 0;

	if (!fill) {
		fill = "black";
	}

	if (!textCache[text]) textCache[text] = {};
	if (
		!textCache[text][p.textSize()] ||
		(textCache[text][p.textSize()] &&
			textCache[text][p.textSize()].color !== fill)
	) {
		// We have to do this twice, I currently have no clue how to reduce this..
		width = 0;
		height = 0;
		for (const character of [...text]) {
			if (isEmoji(character)) {
				p.textFont("Helvetica");
			} else {
				p.textFont(virgilFont);
				if (character == "\n") {
					width = 0;
					height += p.textSize();
				}
			}
			width += p.textWidth(character);
			if (width > maxWidth) {
				maxWidth = width;
			}
		}
		const genCanvas = p.createGraphics(
			maxWidth + 4,
			height + p.textSize() + p.textSize() * 0.5
		);
		genCanvas.translate(2, 2);
		genCanvas.fill(fill);
		genCanvas.strokeWeight(0.3);
		genCanvas.stroke(fill);
		genCanvas.textSize(p.textSize());
		genCanvas.textAlign(p.LEFT, p.TOP);
		width = 0;
		height = 0;
		for (const character of [...text]) {
			if (isEmoji(character)) {
				genCanvas.textFont("Helvetica");
				genCanvas.text(character, width, height);
				width += genCanvas.textWidth(character);
			} else {
				genCanvas.textFont(virgilFont);
				if (character == "\n") {
					width = 0;
					height += p.textSize();
				} else {
					genCanvas.text(character, width, height);
					width += genCanvas.textWidth(character);
				}
			}
			if (width > maxWidth) {
				maxWidth = width;
			}
		}
		textCache[text][p.textSize()] = {
			image: genCanvas,
			width: maxWidth,
			height: height + p.textSize(),
			color: fill,
		};
		genCanvas.remove();
	}
	p.image(textCache[text][p.textSize()].image, x, y);
	p.pop();
	return textCache[text][p.textSize()];
}
