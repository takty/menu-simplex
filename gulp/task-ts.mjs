/**
 * Function for gulp (TS)
 *
 * @author Takuto Yanagida
 * @version 2023-09-22
 */

import gulp from 'gulp';
import plumber from 'gulp-plumber';
import rename from 'gulp-rename';
import changed from 'gulp-changed';
import ts from 'gulp-typescript';

export function makeTsTask(src, dest = './dist', base = null) {
	const tsTask = () => gulp.src(src, { base: base })
		.pipe(plumber())
		.pipe(ts({
			target        : 'es2020',
			module        : 'esnext',
			allowJs       : true,
			checkJs       : true,
			sourceMap     : true,
			removeComments: true,
			strict        : true,
		}))
		.pipe(rename({ extname: '.min.js' }))
		.pipe(changed(dest, { hasChanged: changed.compareContents }))
		.pipe(gulp.dest(dest));
	return tsTask;
}
