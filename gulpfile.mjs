/**
 * Gulpfile
 *
 * @author Takuto Yanagida
 * @version 2022-12-13
 */

const WATCH_OPTS = { ignoreInitial: false, delay: 400 };

import gulp from 'gulp';

import { makeJsTask } from './gulp/task-js.mjs';
import { makeTsTask } from './gulp/task-ts.mjs';
import { makeSassTask } from './gulp/task-sass.mjs';

const js   = makeJsTask('src/[^_]*.js', './dist/js');
const ts   = makeTsTask('src/[^_]*.ts', './dist/js');
const sass = makeSassTask('src/[^_]*.scss', './dist/css');

export const build = gulp.parallel(js, ts, sass);
export default () => {
	gulp.watch('src/**/*.js', WATCH_OPTS, js);
	gulp.watch('src/**/*.ts', WATCH_OPTS, ts);
	gulp.watch('src/**/*.scss', WATCH_OPTS, sass);
};


// -----------------------------------------------------------------------------


export const doc = async () => {
	const { makeCopyTask }      = await import('./gulp/task-copy.mjs');
	const { makeTimestampTask } = await import('./gulp/task-timestamp.mjs');

	const doc_js        = makeCopyTask('dist/js/*', './docs/js');
	const doc_css       = makeCopyTask('dist/css/*', './docs/css');
	const doc_sass      = makeSassTask('docs/style.scss', './docs/css');
	const doc_timestamp = makeTimestampTask('docs/**/*.html', './docs');

	gulp.watch('src/**/*.js', WATCH_OPTS, gulp.series(js, doc_js, doc_timestamp));
	gulp.watch('src/**/*.ts', WATCH_OPTS, gulp.series(ts, doc_js, doc_timestamp));
	gulp.watch('src/**/*.scss', WATCH_OPTS, gulp.series(sass, doc_css, doc_timestamp));
	gulp.watch('docs/style.scss', WATCH_OPTS, gulp.series(doc_sass, doc_timestamp));
};
