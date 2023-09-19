/**
 * Common Functions
 *
 * @author Takuto Yanagida
 * @version 2023-09-20
 */

const scrollListeners = [];

function onScroll(fn, doFirst = false) {
	if (doFirst) fn();
	scrollListeners.push(throttle(fn));
}

document.addEventListener('DOMContentLoaded', () => {
	window.addEventListener('scroll', () => { for (const l of scrollListeners) l(); }, { passive: true });
});

function throttle(fn) {
	let isRunning;
	function run() {
		isRunning = false;
		fn();
	}
	return () => {
		if (isRunning) return;
		isRunning = true;
		requestAnimationFrame(run);
	};
}


// -----------------------------------------------------------------------------


function addHoverStateEventListener(items, clsCurrent, clsHover, root = null, clsHoverAncestor = null) {
	const enter = (e) => {
		if (e.pointerType === 'mouse' && !e.target.classList.contains(clsCurrent)) {
			e.target.classList.add(clsHover);
			if (clsHoverAncestor) {
				for (let elm = e.target.parentElement; elm && elm !== root; elm = elm.parentElement) {
					if (elm.classList.contains(clsHover)) {
						elm.classList.add(clsHoverAncestor);
					}
				}
			}
		}
	}
	const leave = (e) => {
		if (e.pointerType === 'mouse' && !e.target.classList.contains(clsCurrent)) {
			e.target.classList.remove(clsHover);
			if (clsHoverAncestor) {
				for (let elm = e.target.parentElement; elm && elm !== root; elm = elm.parentElement) {
					if (elm.classList.contains(clsHover)) {
						elm.classList.remove(clsHoverAncestor);
					}
				}
			}
		}
	}
	for (const it of items) {
		it.addEventListener('pointerenter', enter);
		it.addEventListener('pointerleave', leave);
	}
}


// -----------------------------------------------------------------------------


let fixed = false;

function fixBackground(enabled) {
	if (fixed === enabled) return;
	fixed = enabled;

	const scrollingElement = () => {
		return ('scrollingElement' in document) ? document.scrollingElement : document.documentElement;
	};
	const sy = enabled ? scrollingElement().scrollTop : parseInt(document.body.style.top ?? '0');
	const cs = getComputedStyle(document.body);
	const mw = parseFloat(cs.marginInlineStart) + parseFloat(cs.marginInlineEnd);
	const ss = {
		position: 'fixed',
		top     : `${-sy}px`,
		left    : '0',
		width   : `calc(100vw - ${mw}px)`,
		height  : '100dvh',

		'overflow-y': 'scroll',  // For keeping scroll bar width.
	};
	for (const [key, value] of Object.entries(ss)) {
		document.body.style[key] = enabled ? value : null;
	}
	if (!enabled) {
		window.scrollTo(0, -sy);
	}
}

function getStylePropertyBool(elm, prop) {
	const val = getComputedStyle(elm).getPropertyValue(prop).trim();
	return !val.length ? null : str2bool(val);
}

function str2bool(str){
	if (typeof str !== 'string') return Boolean(str);
	try {
		return JSON.parse(str.toLowerCase()) == true;
	} catch(e) {
		return str.length !== 0;
	}
}
