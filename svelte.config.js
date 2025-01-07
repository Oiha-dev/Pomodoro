//svelte.config.js

import adapter from '@sveltejs/adapter-node';
/** @type {import('@sveltejs/kit').Config} */


const config = {
	kit: {
		adapter: adapter(),
		paths: {
			base: '/Pomodoro'
		}
	}
};

export default config;

