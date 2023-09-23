/**
 * Menu Simplex (Progressively collapsing menu)
 *
 * @author Takuto Yanagida
 * @version 2023-09-24
 */

window['menu_simplex'] = function (id = null) {
	new MenuSimplex(id);
};

class MenuSimplex {

	static NS = 'menu-simplex';

	static CP_IS_FOLDABLE    = '--is-foldable';
	static CP_IS_CLOSED_AUTO = '--is-closed-auto';
	static CP_IS_BG_FIXED    = '--is-background-fixed';
	static CP_IS_REVERSED    = '--is-reversed';
	static CP_FOLDER_POS     = '--folder-position';

	static CLS_FOLDER  = 'folder';
	static CLS_CURRENT = 'current';

	static CLS_READY          = 'ready';
	static CLS_HOVER          = 'hover';
	static CLS_HOVER_ANCESTOR = 'hover-ancestor';
	static CLS_ACTIVE         = 'active';
	static CLS_OPENED         = 'opened';

	static CP_MAX_WIDTH = '--max-width';


	// -------------------------------------------------------------------------


	static throttle(fn) {
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

	static addHoverStateEventListener(root, elms) {
		const enter = e => {
			const li = e.target.parentElement;

			if (li && e.pointerType === 'mouse' && !li.classList.contains(MenuSimplex.CLS_CURRENT)) {
				li.classList.add(MenuSimplex.CLS_HOVER);
				for (let elm = li.parentElement; elm && elm !== root; elm = elm.parentElement) {
					if (elm.tagName === 'LI') {
						elm.classList.add(MenuSimplex.CLS_HOVER_ANCESTOR);
					}
				}
			}
		}
		const leave = e => {
			const li = e.target.parentElement;

			if (li && e.pointerType === 'mouse' && !li.classList.contains(MenuSimplex.CLS_CURRENT)) {
				li.classList.remove(MenuSimplex.CLS_HOVER);
				for (let elm = li.parentElement; elm && elm !== root; elm = elm.parentElement) {
					if (elm.tagName === 'LI') {
						elm.classList.remove(MenuSimplex.CLS_HOVER_ANCESTOR);
					}
				}
			}
		}
		for (const it of elms) {
			const fec = it.firstElementChild;
			if (fec) {
				fec.addEventListener('pointerenter', enter);
				fec.addEventListener('pointerleave', leave);
			}
		}
	}

	static fixed;

	static fixBackground(enabled) {
		if (MenuSimplex.fixed === enabled) return;
		MenuSimplex.fixed = enabled;

		const scrollingElement = () => {
			return ('scrollingElement' in document) ? document.scrollingElement : document.documentElement;
		};
		const se = scrollingElement();
		if (!se) return;
		const sy = enabled ? se.scrollTop : parseInt(document.body.style.top ?? '0');
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
			document.body.style[key] = enabled ? value : '';
		}
		if (!enabled) {
			window.scrollTo(0, -sy);
		}
	}

	static getStylePropertyBool(elm, prop) {
		const v = getComputedStyle(elm).getPropertyValue(prop).trim();
		if (!v.length) return null;
		if (typeof v !== 'string') return Boolean(v);
		try {
			return 'true' == JSON.parse(v.toLowerCase());
		} catch(e) {
			return v.length !== 0;
		}
	}

	static getStylePropertyString(elm, prop) {
		const v = getComputedStyle(elm).getPropertyValue(prop).trim().replace(new RegExp('^\"+|\"+$', 'g'), '');
		if (!v.length) return null;
		return (typeof v === 'string') ? v : String(v);
	}


	// -------------------------------------------------------------------------


	#divRoot;
	#ulBar;
	#ulFld;
	#liFocusTrap;

	#fldIdx;

	#scrollY = 0;
	#curIts  = [];

	#skipResize = false;

	constructor(id = null) {
		this.#divRoot = id ? document.getElementById(id) : document.getElementsByClassName(MenuSimplex.NS)[0];
		if (!this.#divRoot) return;
		this.#ulBar = this.#divRoot.getElementsByTagName('ul')[0];
		if (!this.#ulBar) throw new DOMException();

		[this.#ulFld, this.#fldIdx] = this.initFolder();
		const its = this.initBarItems();
		this.initPopup(its);
		const order = this.initOrder(its);
		this.#liFocusTrap = this.initFocusTrap();

		const allLis = Array.from(this.#ulBar.querySelectorAll('li'));
		MenuSimplex.addHoverStateEventListener(this.#divRoot, allLis);

		setTimeout(() => {
			const ro = new ResizeObserver(
				() => requestAnimationFrame(() => {
					if (this.#skipResize) {
						this.#skipResize = false;
						return;
					}
					this.closeAll(its);
					this.alignItems(its, order);
				})
			);
			ro.observe(this.#divRoot);
			ro.observe(this.#divRoot.parentElement);
		}, 10);
		setTimeout(() => this.#divRoot.classList.add(MenuSimplex.CLS_READY), 100);
	}

	initFolder() {
		let li  = null;
		let idx = 0;
		for (const e of this.#ulBar.children) {
			if (e.classList.contains(MenuSimplex.CLS_FOLDER)) {
				li = e;
				break;
			}
			idx += 1;
		}
		if (!li) {
			li = document.createElement('li');
			li.classList.add(MenuSimplex.CLS_FOLDER);

			const pos = MenuSimplex.getStylePropertyString(this.#divRoot, MenuSimplex.CP_FOLDER_POS);
			if (null === pos || 'end' === pos) {
				this.#ulBar.append(li);
				idx = this.#ulBar.children.length - 1;
			} else if ('start' === pos) {
				this.#ulBar.prepend(li);
				idx = 0;
			}
		}
		let btn = li.querySelector(':scope > button');
		if (!btn) {
			btn = document.createElement('button');
			li.appendChild(btn);
		}
		let ul = li.querySelector(':scope > button + ul, :scope > button + * > ul');
		if (!ul) {
			ul = document.createElement('ul');
			ul.classList.add('menu');
			li.appendChild(ul);
		}
		return [ul, idx];
	}

	initBarItems() {
		const its = [];
		const lis = Array.from(this.#ulBar.querySelectorAll(':scope > li'));
		for (const li of lis) {
			const btn = li.querySelector(':scope > button');
			const popup = btn?.nextElementSibling;
			const width = li.offsetWidth;
			its.push({ li, btn, popup, width });
		}
		return its;
	}

	initPopup(its) {
		for (const it of its) {
			const { li, btn, popup } = it;
			if (!btn || !popup) continue;

			btn.setAttribute('area-expanded', 'false');
			if (!popup.id) {
				const id = btn.id ? btn.id : (li.id ? li.id : '');
				if (id) {
					popup.id = id + '-sub';
				}
			}
			if (popup.id) {
				btn.setAttribute('area-controls', popup.id);
			}
			btn.addEventListener('click', e => {
				if (btn.classList.contains(MenuSimplex.CLS_OPENED)) {
					this.close(it);
				} else {
					if (this.#ulBar === li.parentElement) {
						this.closeAll(its, btn);
					}
					this.open(it);
				}
				e.stopPropagation();
			});
		}
		window.addEventListener('keydown', e => {
			if (e.key === 'Escape') {
				if (this.#curIts.length) {
					const btn = this.#curIts[this.#curIts.length - 1].btn;
					if (btn) {
						btn.focus();
						btn.click();
					}
				}
			}
		});
		if (true === MenuSimplex.getStylePropertyBool(this.#divRoot, MenuSimplex.CP_IS_CLOSED_AUTO)) {
			document.addEventListener('DOMContentLoaded', () => {
				window.addEventListener('scroll', MenuSimplex.throttle(() => this.doOnScroll(its)), { passive: true });
			});
			document.addEventListener('click', () => this.closeAll(its));
		}
	}

	initOrder(its) {
		const ws = new Array(its.length);
		for (let i = 0; i < its.length; i += 1) {
			const { li } = its[i];
			ws[i] = this.getWeightFromClass(li, its.length - i);
		}
		const order = new Array(its.length);
		for (let i = 0; i < its.length; i += 1) order[i] = i;
		order.sort((a, b) => ws[a] < ws[b] ? 1 : ws[a] > ws[b] ? -1 : 0);

		if (true === MenuSimplex.getStylePropertyBool(this.#divRoot, MenuSimplex.CP_IS_REVERSED)) {
			order.reverse();
		}
		return order;
	}

	getWeightFromClass(li, def) {
		const cs = li.className.split(' ');
		let w = null;
		for (const c of cs) {
			const n = parseInt(c, 10);
			if (isNaN(n)) continue;
			if (null === w || w < n) w = n;
		}
		return w ?? def;
	}

	initFocusTrap() {
		const e = document.createElement('li');
		e.className = 'focus-trap';
		e.tabIndex = 0;
		e.addEventListener('focus', () => {
			if (this.#curIts.length) {
				const { btn } = this.#curIts[0];
				if (btn) btn.focus();
			}
		});
		return e;
	}


	// -------------------------------------------------------------------------


	open(it) {
		const { li, btn, popup } = it;
		if (!btn || !popup) return;

		li.classList.add(MenuSimplex.CLS_OPENED);
		btn.classList.add(MenuSimplex.CLS_OPENED);
		btn.setAttribute('area-expanded', 'true');
		popup.classList.add(MenuSimplex.CLS_ACTIVE);

		setTimeout(() => popup.classList.add(MenuSimplex.CLS_OPENED), 0);
		this.#curIts.push(it);

		popup.style.transform = '';
		if (this.#curIts[0].popup) {
			this.adjustPopupInline(this.#curIts[0].popup);
		}
		this.#scrollY = window.scrollY;

		if (1 === this.#curIts.length) {
			const ul = ('UL' === popup.tagName) ? popup : popup.getElementsByClassName('UL')?.[0];
			if (ul) {
				ul.appendChild(this.#liFocusTrap);
			}
		}

		if (true === MenuSimplex.getStylePropertyBool(this.#divRoot, MenuSimplex.CP_IS_BG_FIXED)) {
			this.#skipResize = true;
			MenuSimplex.fixBackground(true);
		}
	}

	adjustPopupInline(popup) {
		popup.style.transform = '';
		popup.style.maxWidth = '';
		let pr = popup.getBoundingClientRect();
		const rr = this.#divRoot.getBoundingClientRect();
		if (rr.width < pr.width) {
			popup.style.maxWidth = `${rr.width}px`;
			pr = popup.getBoundingClientRect();
		}
		if (rr.right < pr.right) {
			popup.style.transform = `translateX(${rr.right - pr.right}px)`;
		}
		if (pr.left < rr.left) {
			popup.style.transform = `translateX(${pr.left - rr.left}px)`;
		}
	}

	close(it) {
		const { li, btn, popup } = it;
		if (!btn || !popup) return;

		li.classList.remove(MenuSimplex.CLS_OPENED);
		btn.classList.remove(MenuSimplex.CLS_OPENED);
		btn.setAttribute('area-expanded', 'false');
		popup.classList.remove(MenuSimplex.CLS_OPENED);

		setTimeout(() => {
			popup.classList.remove(MenuSimplex.CLS_ACTIVE);
			if (this.#curIts.length) {
				const { popup } = this.#curIts[0];
				if (popup) this.adjustPopupInline(popup);
			}
		}, 200);
		this.#curIts.pop();

		if (0 === this.#curIts.length) {
			const ul = ('UL' === popup.tagName) ? popup : popup.getElementsByClassName('UL')?.[0];
			if (ul && this.#liFocusTrap.parentElement === ul) {
				ul.removeChild(this.#liFocusTrap);
			}
		}

		if (MenuSimplex.getStylePropertyBool(this.#divRoot, MenuSimplex.CP_IS_BG_FIXED)) {
			this.#skipResize = true;
			MenuSimplex.fixBackground(false);
		}
	}

	closeAll(its, opening = null) {
		if (!this.#curIts.length) return;

		for (const it of its) {
			const { btn } = it;
			if (btn && opening !== btn) {
				this.close(it);
			}
		}
		this.#curIts.length = 0;

		if (MenuSimplex.getStylePropertyBool(this.#divRoot, MenuSimplex.CP_IS_BG_FIXED)) {
			this.#skipResize = true;
			MenuSimplex.fixBackground(false);
		}
	}

	doOnScroll(its) {
		if (!this.#curIts.length || !this.#curIts[0].popup) {
			return;
		}
		const bcr = this.#curIts[0].popup.getBoundingClientRect();
		if (
			bcr.bottom < 0 ||  // When not fixed
			(0 < bcr.top && bcr.bottom < Math.abs(window.scrollY - this.#scrollY))  // When fixed
		) {
			this.closeAll(its);
		}
	}

	alignItems(its, order) {
		this.setMaxWidth();
		const inBar = this.calcItemPlace(its, order);

		if (false === MenuSimplex.getStylePropertyBool(this.#divRoot, MenuSimplex.CP_IS_FOLDABLE)) {
			inBar.fill(true);
			inBar[this.#fldIdx] = false;
		}
		its[this.#fldIdx].li.style.display = inBar[this.#fldIdx] ? '' : 'none';

		let prevElm = this.#ulBar.firstChild;
		for (let i = 0; i < its.length; i += 1) {
			const { li } = its[i];
			if (inBar[i]) {
				if (li.parentElement === this.#ulBar) {
					its[i].width = li.offsetWidth;
				}
				this.#ulBar.insertBefore(li, prevElm.nextElementSibling);
				prevElm = li;
			} else if(i !== this.#fldIdx) {
				this.#ulFld.appendChild(li);
			}
		}
	}

	setMaxWidth() {
		const p = this.#divRoot.parentElement;
		if (p) {
			const s = getComputedStyle(p);
			const w = p.clientWidth - (parseFloat(s.paddingLeft) + parseFloat(s.paddingRight));
			this.#divRoot.style.setProperty(MenuSimplex.CP_MAX_WIDTH, `${Math.floor(w)}px`);
		}
	}

	calcItemPlace(its, order) {
		const inBar = new Array(its.length);

		const gap  = this.calcBarGap();
		const sumW = its.reduce((s, v) => s + v.width, 0) + (gap * (its.length - 1)) - (its[this.#fldIdx].width + gap);
		let barW   = this.calcBarWidth();

		if (barW < sumW) {
			barW -= its[this.#fldIdx].width;
			inBar[this.#fldIdx] = true;

			for (const idx of order) {
				if (idx !== this.#fldIdx) {
					barW -= its[idx].width + gap;
					inBar[idx] = (0 <= barW);
				}
			}
		} else {
			inBar.fill(true);
			inBar[this.#fldIdx] = false;
		}
		return inBar;
	}

	calcBarWidth() {
		this.#ulBar.style.width = '0';
		let w = Math.floor(this.#divRoot.getBoundingClientRect().width);

		if (0 === w && this.#divRoot.parentElement) {
			const s = getComputedStyle(this.#divRoot.parentElement);
			if (s.display.endsWith('flex')) {
				this.#divRoot.style.flexGrow = '1';
				w = Math.floor(this.#divRoot.getBoundingClientRect().width);
				this.#divRoot.style.flexGrow = '';
			}
		}

		this.#ulBar.style.width = '';
		return w;
	}

	calcBarGap() {
		const s = getComputedStyle(this.#ulBar);
		const g = parseInt(s.columnGap, 10);
		return Number.isNaN(g) ? 0 : g;
	}

}
