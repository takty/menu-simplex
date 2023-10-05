/**
 * Menu Simplex (Progressively collapsing menu)
 *
 * @author Takuto Yanagida
 * @version 2023-10-05
 */

export class MenuSimplex {

	static NS = 'menu-simplex';

	static CLS_PANEL       = 'panel';
	static CLS_PANEL_POPUP = 'panel-popup';
	static CLS_PANEL_MORE  = 'panel-more';
	static CLS_MENU        = 'menu';
	static CLS_MENU_BAR    = 'menu-bar';
	static CLS_MENU_POPUP  = 'menu-popup';
	static CLS_MENU_MORE   = 'menu-more';
	static CLS_FOCUS_TRAP  = 'focus-trap';

	static CP_IS_CLOSED_AUTO = '--is-closed-auto';
	static CP_IS_BG_FIXED    = '--is-background-fixed';
	static CP_IS_REVERSED    = '--is-reversed';
	static CP_MORE_POS       = '--more-position';
	static CP_COLLAPSED      = '--collapsed';

	static CLS_MORE    = 'more';
	static CLS_CURRENT = 'current';

	static CLS_READY            = 'ready';
	static CLS_HOVER            = 'hover';
	static CLS_HOVER_ANCESTOR   = 'hover-ancestor';
	static CLS_ACTIVE           = 'active';
	static CLS_OPENED           = 'opened';
	static CLS_IS_COLLAPSED     = 'is-collapsed';
	static CLS_IS_COLLAPSED_ALL = 'is-collapsed-all';

	static CP_MAX_WIDTH = '--max-width';


	// -------------------------------------------------------------------------


	private static throttle(fn: Function): () => void {
		let isRunning: boolean;
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

	private static addHoverStateEventListener(root: HTMLElement, elms: Element[]) {
		const enter = (e: PointerEvent) => {
			const li = (e.target as HTMLElement).parentElement;

			if (li && 'mouse' === e.pointerType && !li.classList.contains(MenuSimplex.CLS_CURRENT)) {
				li.classList.add(MenuSimplex.CLS_HOVER);
				for (let elm = li.parentElement; elm && elm !== root; elm = elm.parentElement) {
					if ('LI' === elm.tagName) {
						elm.classList.add(MenuSimplex.CLS_HOVER_ANCESTOR);
					}
				}
			}
		}
		const leave = (e: PointerEvent) => {
			const li = (e.target as HTMLElement).parentElement;

			if (li && 'mouse' === e.pointerType && !li.classList.contains(MenuSimplex.CLS_CURRENT)) {
				li.classList.remove(MenuSimplex.CLS_HOVER);
				for (let elm = li.parentElement; elm && elm !== root; elm = elm.parentElement) {
					if ('LI' === elm.tagName) {
						elm.classList.remove(MenuSimplex.CLS_HOVER_ANCESTOR);
					}
				}
			}
		}
		for (const it of elms) {
			const fec = it.firstElementChild as HTMLElement;
			if (fec) {
				fec.addEventListener('pointerenter', enter);
				fec.addEventListener('pointerleave', leave);
			}
		}
	}

	private static fixed: boolean;

	private static fixBackground(enabled: boolean) {
		if (MenuSimplex.fixed === enabled) return;
		MenuSimplex.fixed = enabled;

		const scrollingElement = () => {
			return ('scrollingElement' in document) ? document.scrollingElement : (<Document>document).documentElement;
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
			(document.body.style as any)[key] = enabled ? value : '';
		}
		if (!enabled) {
			window.scrollTo(0, -sy);
		}
	}

	private static getStylePropertyBool(elm: HTMLElement, prop: string): boolean|null {
		let v = getComputedStyle(elm).getPropertyValue(prop).trim();
		if (('"' === v.at(0) && '"' === v.at(-1)) || ("'" === v.at(0) && "'" === v.at(-1))) {
			v = v.slice(1, -1);
		}
		if (!v.length) return null;
		if (typeof v !== 'string') return Boolean(v);
		try {
			return true === JSON.parse(v.toLowerCase());
		} catch(e) {
			return v.length !== 0;
		}
	}

	private static getStylePropertyString(elm: HTMLElement, prop: string): string|null {
		const v = getComputedStyle(elm).getPropertyValue(prop).trim().replace(new RegExp('^\"+|\"+$', 'g'), '');
		if (!v.length) return null;
		return (typeof v === 'string') ? v : String(v);
	}


	// -------------------------------------------------------------------------


	#divRoot    : HTMLElement;
	#ulBar      : HTMLElement;
	#ulMore     : HTMLElement;
	#liFocusTrap: HTMLElement;

	#moreIdx: number;

	#scrollY: number = 0;
	#curIts : Item[] = [];

	#skipResize: boolean = false;

	constructor(id: string|null = null) {
		const divRoot = id ? document.getElementById(id) : document.getElementsByClassName(MenuSimplex.NS)[0];
		if (!divRoot) throw new DOMException();
		this.#divRoot = divRoot as HTMLElement;
		this.#ulBar   = this.#divRoot.getElementsByTagName('ul')[0];
		if (!this.#ulBar) throw new DOMException();
		this.#ulBar.classList.add(MenuSimplex.CLS_MENU, MenuSimplex.CLS_MENU_BAR);

		if (!this.#divRoot.classList.contains(MenuSimplex.NS)) {
			this.#divRoot.classList.add(MenuSimplex.NS);
		}

		[this.#ulMore, this.#moreIdx] = this.initMore();
		const its = this.initBarItems();
		this.initPanel(its);
		const order = this.initOrder(its);
		this.#liFocusTrap = this.initFocusTrap();

		const allLis = Array.from(this.#ulBar.querySelectorAll('li'));
		MenuSimplex.addHoverStateEventListener(this.#divRoot, allLis);

		const onResize = () => {
			if (this.#skipResize) {
				this.#skipResize = false;
				return;
			}
			this.closeAll(its);
			this.alignItems(its, order);
		};
		setTimeout(() => {
			const ro = new ResizeObserver(() => requestAnimationFrame(onResize));
			ro.observe(this.#divRoot);
			ro.observe(this.#divRoot.parentElement as HTMLElement);
		}, 10);
		setTimeout(() => this.#divRoot.classList.add(MenuSimplex.CLS_READY), 100);
	}

	private initMore(): [HTMLElement, number] {
		let li: HTMLElement|null = null;
		let idx = 0;
		for (const e of Array.from(this.#ulBar.children)) {
			if (e.classList.contains(MenuSimplex.CLS_MORE)) {
				li = e as HTMLElement;
				break;
			}
			idx += 1;
		}
		if (!li) {
			li = document.createElement('li');
			li.classList.add(MenuSimplex.CLS_MORE);

			const pos = MenuSimplex.getStylePropertyString(this.#divRoot, MenuSimplex.CP_MORE_POS);
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
			btn.setAttribute('title', 'More');
			li.insertBefore(btn, li.firstChild);
		}
		const uls = li.querySelectorAll(':scope > ul, :scope > div > ul');
		let ul = Array.from(uls).find(e => !e.children.length) as HTMLElement;
		if (!ul) {
			ul = document.createElement('ul');
			const div = li.querySelector(':scope > div');
			if (div) {
				div.appendChild(ul);
			} else {
				li.appendChild(ul);
			}
		}
		ul.classList.add(MenuSimplex.CLS_MENU, MenuSimplex.CLS_MENU_MORE);
		const panel = (ul.parentElement === li) ? ul : (ul.parentElement as HTMLElement);
		panel.classList.add(MenuSimplex.CLS_PANEL, MenuSimplex.CLS_PANEL_MORE);
		return [ul, idx];
	}

	private initBarItems(): Item[] {
		const its: Item[] = [];
		const lis = Array.from(this.#ulBar.querySelectorAll(':scope > li'));
		for (const li of lis) {
			const btn = li.querySelector(':scope > button') as HTMLElement;
			const panel = li.querySelector(':scope > :is(ul, div)') as HTMLElement;
			if (panel && !li.classList.contains(MenuSimplex.CLS_MORE)) {
				panel.classList.add(MenuSimplex.CLS_PANEL, MenuSimplex.CLS_PANEL_POPUP);
				const menu = ('UL' === panel.tagName) ? panel : panel.querySelector(':scope > ul') as HTMLElement;
				menu.classList.add(MenuSimplex.CLS_MENU, MenuSimplex.CLS_MENU_POPUP);
			}
			its.push(new Item(li as HTMLElement, btn, panel, 0));
		}
		return its;
	}

	private initPanel(its: Item[]) {
		for (const it of its) {
			const { li, btn, panel } = it;
			if (!btn || !panel) continue;

			btn.setAttribute('area-expanded', 'false');
			if (!panel.id) {
				const id = btn.id ? btn.id : (li.id ? li.id : '');
				if (id) {
					panel.id = id + '-sub';
				}
			}
			if (panel.id) {
				btn.setAttribute('area-controls', panel.id);
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
		window.addEventListener('keydown', (e) => {
			if ('Escape' === e.key) {
				const it = this.#curIts.at(-1);
				if (it) {
					const { btn } = it;
					if (btn) {
						btn.focus();
						btn.click();
					}
				}
			}
		});
		if (MenuSimplex.getStylePropertyBool(this.#divRoot, MenuSimplex.CP_IS_CLOSED_AUTO)) {
			document.addEventListener('DOMContentLoaded', () => {
				window.addEventListener('scroll', MenuSimplex.throttle(() => this.doOnScroll(its)), { passive: true });
			});
			document.addEventListener('click', () => this.closeAll(its));
		}
	}

	private initOrder(its: Item[]): number[] {
		const rev = MenuSimplex.getStylePropertyBool(this.#divRoot, MenuSimplex.CP_IS_REVERSED);

		const ws = new Array(its.length);
		for (let i = 0; i < its.length; i += 1) {
			const { li } = its[i];
			ws[i] = this.getWeightFromClass(li, rev ? i : its.length - i);
		}
		const order = new Array(its.length);
		for (let i = 0; i < its.length; i += 1) order[i] = i;
		order.sort((a: number, b: number) => ws[a] < ws[b] ? 1 : ws[a] > ws[b] ? -1 : 0);

		return order;
	}

	private getWeightFromClass(li: Element, def: number): number {
		const cs = li.className.split(' ');
		let w: number|null = null;
		for (const c of cs) {
			const n = parseInt(c, 10);
			if (isNaN(n)) continue;
			if (null === w || w < n) w = n;
		}
		return w ?? def;
	}

	private initFocusTrap(): HTMLElement {
		const e = document.createElement('li');
		e.className = MenuSimplex.CLS_FOCUS_TRAP;
		e.tabIndex  = 0;
		e.addEventListener('focus', () => {
			if (this.#curIts.length) {
				const { btn } = this.#curIts[0];
				if (btn) btn.focus();
			}
		});
		return e;
	}


	// -------------------------------------------------------------------------


	private open(it: Item) {
		const { li, btn, panel } = it;
		if (!btn || !panel) return;

		li.classList.add(MenuSimplex.CLS_OPENED);
		btn.classList.add(MenuSimplex.CLS_OPENED);
		btn.setAttribute('area-expanded', 'true');
		panel.classList.add(MenuSimplex.CLS_ACTIVE);

		setTimeout(() => panel.classList.add(MenuSimplex.CLS_OPENED), 0);
		this.#curIts.push(it);

		panel.style.transform = '';
		if (this.#curIts[0].panel) {
			this.adjustPanelInline(this.#curIts[0].panel);
		}
		this.#scrollY = window.scrollY;

		if (1 === this.#curIts.length) {
			const ul = ('UL' === panel.tagName) ? panel : panel.getElementsByTagName('ul')?.[0];
			if (ul) {
				ul.appendChild(this.#liFocusTrap);
			}
		}

		if (MenuSimplex.getStylePropertyBool(this.#divRoot, MenuSimplex.CP_IS_BG_FIXED)) {
			this.#skipResize = true;
			MenuSimplex.fixBackground(true);
		}
	}

	private adjustPanelInline(panel: HTMLElement) {
		panel.style.transform = '';
		panel.style.maxWidth = '';
		let pr = panel.getBoundingClientRect();
		const rr = this.#divRoot.getBoundingClientRect();
		if (rr.width < pr.width) {
			panel.style.maxWidth = `${rr.width}px`;
			pr = panel.getBoundingClientRect();
		}
		if (rr.right < pr.right) {
			panel.style.transform = `translateX(${rr.right - pr.right}px)`;
		}
		if (pr.left < rr.left) {
			panel.style.transform = `translateX(${pr.left - rr.left}px)`;
		}
	}

	private close(it: Item) {
		const { li, btn, panel } = it;
		if (!btn || !panel) return;

		li.classList.remove(MenuSimplex.CLS_OPENED);
		btn.classList.remove(MenuSimplex.CLS_OPENED);
		btn.setAttribute('area-expanded', 'false');
		panel.classList.remove(MenuSimplex.CLS_OPENED);

		setTimeout(() => {
			panel.classList.remove(MenuSimplex.CLS_ACTIVE);
			if (this.#curIts.length) {
				const { panel } = this.#curIts[0];
				if (panel) this.adjustPanelInline(panel);
			}
		}, 200);
		this.#curIts.pop();

		if (0 === this.#curIts.length) {
			const ul = ('UL' === panel.tagName) ? panel : panel.getElementsByTagName('ul')?.[0];
			if (ul && this.#liFocusTrap.parentElement === ul) {
				ul.removeChild(this.#liFocusTrap);
			}
		}

		if (MenuSimplex.getStylePropertyBool(this.#divRoot, MenuSimplex.CP_IS_BG_FIXED)) {
			this.#skipResize = true;
			MenuSimplex.fixBackground(false);
		}
	}

	private closeAll(its: Item[], opening: HTMLElement|null = null) {
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

	private doOnScroll(its: Item[]) {
		if (!this.#curIts.length || !this.#curIts[0].panel) {
			return;
		}
		const bcr = this.#curIts[0].panel.getBoundingClientRect();
		if (
			bcr.bottom < 0 ||  // When not fixed
			(0 < bcr.top && bcr.bottom < Math.abs(window.scrollY - this.#scrollY))  // When fixed
		) {
			this.closeAll(its);
		}
	}

	private alignItems(its: Item[], order: number[]) {
		this.setMaxWidth();
		const inBar = this.calcItemPlace(its, order);
		its[this.#moreIdx].li.style.display = inBar[this.#moreIdx] ? '' : 'none';
		this.setCollapsedState(inBar);

		let prevElm = this.#ulBar.firstChild as HTMLElement;
		for (let i = 0; i < its.length; i += 1) {
			const { li } = its[i];
			if (inBar[i]) {
				if (li.parentElement === this.#ulBar) {
					li.style.flexGrow = '0';
					its[i].width = li.offsetWidth;
					li.style.flexGrow = '';
				}
				this.#ulBar.insertBefore(li, prevElm.nextElementSibling);
				prevElm = li;
			} else if(i !== this.#moreIdx) {
				this.#ulMore.appendChild(li);
			}
		}
	}

	private setMaxWidth() {
		const p = this.#divRoot.parentElement;
		if (p) {
			const s = getComputedStyle(p);
			const w = p.clientWidth - (parseFloat(s.paddingLeft) + parseFloat(s.paddingRight));
			this.#divRoot.style.setProperty(MenuSimplex.CP_MAX_WIDTH, `${Math.floor(w)}px`);
		}
	}

	private setCollapsedState(inBar: boolean[]) {
		if (inBar[this.#moreIdx]) {
			this.#divRoot.classList.add(MenuSimplex.CLS_IS_COLLAPSED);
		} else {
			this.#divRoot.classList.remove(MenuSimplex.CLS_IS_COLLAPSED);
		}
		if (inBar.every((e, i) => (i === this.#moreIdx || !e))) {
			this.#divRoot.classList.add(MenuSimplex.CLS_IS_COLLAPSED_ALL);
		} else {
			this.#divRoot.classList.remove(MenuSimplex.CLS_IS_COLLAPSED_ALL);
		}
	}

	private calcItemPlace(its: Item[], order: number[]): boolean[] {
		const inBar = new Array(its.length);
		switch (MenuSimplex.getStylePropertyString(this.#divRoot, MenuSimplex.CP_COLLAPSED)) {
			case 'never':
				inBar.fill(true);
				inBar[this.#moreIdx] = false;
				return inBar;
			case 'always':
				inBar.fill(false);
				inBar[this.#moreIdx] = true;
				return inBar;
		}
		for (let i = 0; i < its.length; i += 1) {
			if (0 === its[i].width) its[i].width = its[i].li.offsetWidth;
		}
		const gap  = this.calcBarGap();
		const sumW = its.reduce((s: number, v: Item) => s + v.width, 0) + (gap * (its.length - 1)) - (its[this.#moreIdx].width + gap);
		let barW   = this.calcBarWidth();

		if (barW < sumW) {
			barW -= its[this.#moreIdx].width;
			inBar[this.#moreIdx] = true;

			for (const idx of order) {
				if (idx !== this.#moreIdx) {
					barW -= its[idx].width + gap;
					inBar[idx] = (0 <= barW);
				}
			}
		} else {
			inBar.fill(true);
			inBar[this.#moreIdx] = false;
		}
		return inBar;
	}

	private calcBarWidth(): number {
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

	private calcBarGap(): number {
		const s = getComputedStyle(this.#ulBar);
		const g = parseInt(s.columnGap, 10);
		return Number.isNaN(g) ? 0 : g;
	}

}

class Item {

	constructor(public li:HTMLElement, public btn:HTMLElement|null, public panel:HTMLElement|null, public width: number) {
		this.li    = li;
		this.btn   = btn;
		this.panel = panel;
		this.width = width;
	}

}
