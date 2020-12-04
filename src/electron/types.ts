export interface IMoveWindowFromMouseData {
	mouseX: number;
	mouseY: number;
}

export interface IMoveWindowFromKeysData {
	shiftX: number;
	shiftY: number;
}

export enum EMoveWindowKeys {
	W = 'KeyW',
	S = 'KeyS',
	A = 'KeyA',
	D = 'KeyD',
	Up = 'ArrowUp',
	Down = 'ArrowDown',
	Left = 'ArrowLeft',
	Right = 'ArrowRight'
}