export function createRoundedRectPath(w: number, h: number, r: number) {
	return `M ${r} 0 L ${w - r} 0 Q ${w} 0, ${w} ${r} L ${w} ${
		h - r
	} Q ${w} ${h}, ${w - r} ${h} L ${r} ${h} Q 0 ${h}, 0 ${
		h - r
	} L 0 ${r} Q 0 0, ${r} 0`;
}
