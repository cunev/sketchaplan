import p5 from "p5";
import { p } from "./p5";

export let assets: Map<string, p5.Image> = new Map();

export function addAsset(img: string) {
	assets.set(img, p.loadImage(img));
}
export function addAssetRaw(name: string, img: p5.Image) {
	assets.set(name, img);
}
