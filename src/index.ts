// @see https://github.com/immerjs/immer/issues/557
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as unknown as any).process = {
	env: {
		NODE_ENV: "production"
	}
};
