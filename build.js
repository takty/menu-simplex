import { build } from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';

await build({
	entryPoints : ['src/menu-simplex.ts', 'src/menu-simplex.scss'],
	plugins     : [sassPlugin()],
	outdir      : 'dist',
	outExtension: { '.js': '.min.js', '.css': '.min.css' },
	minify      : true,
	sourcemap   : true,
});
