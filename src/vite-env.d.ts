/// <reference types="vite/client" />
declare module "serialize-to-js" {
	export = serialize;

	function serialize(
		source: any,
		options?: {
			ignoreCircular?: boolean;
			reference?: boolean;
			unsafe?: boolean;
		}
	): string;
}
