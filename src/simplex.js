/**
 * Menu Simplex (Progressively collapsing menu)
 *
 * @author Takuto Yanagida
 * @version 2023-09-20
 */

window['menu_simplex'] = window['menu_simplex'] ?? {};

window['menu_simplex'] = function (id = null, opts = {}) {
	const NS = 'menu-simplex';

	const CLS_CURRENT = 'current';

	const CLS_READY  = 'ready';
	const CLS_HOVER  = 'hover';
	const CLS_ACTIVE = 'active';
	const CLS_OPENED = 'opened';

	const CP_MAX_WIDTH   = '--max-width';
	const CP_IS_FOLDABLE = '--is-foldable';
	const CP_IS_BG_FIXED = '--is-background-fixed';

	const root = id ? document.getElementById(id) : document.getElementsByClassName(NS)[0];
	if (!root) return;
	const ulBar = root.getElementsByTagName('ul')[0];
	if (!ulBar) return;

	const autoClose = opts['autoClose']      ?? true;
	const reversed  = opts['reversed']       ?? false;
	const btnPos    = opts['buttonPosition'] ?? 'end';  // 'start' or 'end';

	let scrollY = 0;
	let curBtns = [];


	// -------------------------------------------------------------------------


	// @include _common.js


	// -------------------------------------------------------------------------


	const ulFolder = initFolder(ulBar, btnPos);
	const lis      = Array.from(ulBar.querySelectorAll(':scope > li'));
	const fIdx     = lis.findIndex(e => e.classList.contains('hamburger'));
	const buttons  = initPopup(ulBar, lis, autoClose);
	const order    = initOrder(lis, reversed);

	for (const li of lis) {
		li.addEventListener('click', () => closeAll(buttons));
	}
	addHoverStateEventListener(lis, CLS_CURRENT, CLS_HOVER);

	let skipResize = false;

	let ws = [];
	setTimeout(() => {
		ws = lis.map(e => e.offsetWidth);
		const rob = new ResizeObserver(() => {
			requestAnimationFrame(() => {
				if (skipResize) {
					skipResize = false;
					return;
				}
				setMaxWidth(root);
				closeAll(buttons);
				alignItems(ws, ulBar, ulFolder, lis, fIdx, order);
			});
		});
		rob.observe(root);
		rob.observe(root.parentElement);
	}, 10);
	setTimeout(() => root.classList.add(CLS_READY), 100);


	// -------------------------------------------------------------------------


	function initOrder(lis, reversed) {
		const ws = new Array(lis.length);
		for (let i = 0; i < lis.length; i += 1) {
			ws[i] = getWeightFromClass(lis[i], lis.length - i);
		}
		const order = new Array(lis.length);
		for (let i = 0; i < lis.length; i += 1) order[i] = i;
		order.sort((a, b) => ws[a] < ws[b] ? 1 : ws[a] > ws[b] ? -1 : 0);

		if (reversed) {
			order.reverse();
		}
		return order;
	}

	function getWeightFromClass(li, def) {
		const cs = li.className.split(' ');
		let w = null;
		for (const c of cs) {
			const n = parseInt(c, 10);
			if (isNaN(n)) continue;
			if (null === w || w < n) w = n;
		}
		return w ?? def;
	}

	function initFolder(ulBar, btnPos) {
		let li = ulBar.querySelector('li.hamburger');
		if (!li) {
			li = document.createElement('li');
			li.classList.add('hamburger');

			if ('end' === btnPos) {
				ulBar.append(li);
			} else if ('start' === btnPos) {
				ulBar.prepend(li);
			}
		}
		let btn = li.querySelector('button:first-of-type');
		if (!btn) {
			btn = document.createElement('button');
			li.appendChild(btn);
		}
		let ul = li.querySelector('button + ul');
		if (!ul) {
			ul = document.createElement('ul');
			ul.classList.add('menu');
			li.appendChild(ul);
		}
		return ul;
	}

	function initPopup(ulBar, lis, autoClose) {
		const bs = [];
		for (const li of lis) {
			const btn = li.querySelector(':scope > button');
			if (!btn) continue;
			const popup = btn.nextElementSibling;
			if (!popup) continue;

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
			btn.addEventListener('click', (e) => {
				if (btn.classList.contains(CLS_OPENED)) {
					close(btn);
				} else {
					if (ulBar === li.parentElement) {
						closeAll(bs, btn);
					}
					open(btn);
					scrollY = window.scrollY;
				}
				e.stopPropagation();
			});
			bs.push(btn);
		}
		window.addEventListener('keydown', e => {
			if (e.key === 'Escape') {
				if (curBtns.length) {
					curBtns[curBtns.length - 1].focus();
					curBtns[curBtns.length - 1].click();
				}
			}
		});
		if (autoClose) {
			onScroll(() => doOnScroll(ulBar, bs, scrollY));
			document.addEventListener('click', () => closeAll(bs));
		}
		return bs;
	}


	// -------------------------------------------------------------------------


	function open(btn) {
		const li    = btn.parentElement;
		const popup = btn.nextElementSibling;
		if (!popup) return;

		li.classList.add(CLS_OPENED);
		btn.classList.add(CLS_OPENED);
		btn.setAttribute('area-expanded', 'true');

		popup.classList.add(CLS_ACTIVE);
		setTimeout(() => {
			popup.classList.add(CLS_OPENED);
		}, 0);
		curBtns.push(btn);

		if (true === getStylePropertyBool(root, CP_IS_BG_FIXED)) {
			skipResize = true;
			fixBackground(true);
		}
	}

	function close(btn) {
		const li    = btn.parentElement;
		const popup = btn.nextElementSibling;
		if (!popup) return;

		li.classList.remove(CLS_OPENED);
		btn.classList.remove(CLS_OPENED);
		btn.setAttribute('area-expanded', 'false');

		popup.classList.remove(CLS_OPENED);
		setTimeout(() => {
			popup.classList.remove(CLS_ACTIVE);
		}, 200);
		curBtns.pop();

		if (getStylePropertyBool(root, CP_IS_BG_FIXED)) {
			skipResize = true;
			fixBackground(false);
		}
	}

	function closeAll(buttons, opening = null) {
		for (const btn of buttons) {
			if (opening !== btn) {
				close(btn);
			}
		}
		curBtns.length = 0;

		if (getStylePropertyBool(root, CP_IS_BG_FIXED)) {
			skipResize = true;
			fixBackground(false);
		}
	}

	function doOnScroll(ulBar, buttons, scrollTop) {
		const bcr = ulBar.getBoundingClientRect();
		if (
			bcr.bottom < 0 ||  // When not fixed
			(0 < bcr.top && bcr.bottom < Math.abs(window.scrollY - scrollTop))  // When fixed
		) {
			closeAll(buttons);
		}
	}

	function setMaxWidth(root) {
		const p  = root.parentElement;
		const cs = getComputedStyle(p);
		const w  = p.clientWidth - (parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight));
		root.style.setProperty(CP_MAX_WIDTH, `${Math.floor(w)}px`);
	}

	function alignItems(ws, ulBar, ulFolder, lis, fIdx, order) {
		ulBar.style.width = '0';
		const barW = Math.floor(ulBar.parentElement.getBoundingClientRect().width);
		ulBar.style.width = null;

		let colGap = parseInt(getComputedStyle(ulBar).columnGap, 10);
		colGap = Number.isNaN(colGap) ? 0 : colGap;

		const inBar = calcItemPlace(barW, ws, order, colGap, fIdx);

		if (false === getStylePropertyBool(root, CP_IS_FOLDABLE)) {
			inBar.fill(true);
			inBar[fIdx] = false;
		}
		lis[fIdx].style.display = inBar[fIdx] ? null : 'none';

		let prevElm = ulBar.firstChild;
		for (let i = 0; i < lis.length; i += 1) {
			const li = lis[i];
			if (inBar[i]) {
				if (li.parentElement === ulBar) {
					ws[i] = li.offsetWidth;
				}
				ulBar.insertBefore(li, prevElm.nextElementSibling);
				prevElm = li;
			} else if(i !== fIdx) {
				ulFolder.appendChild(li);
			}
		}
	}

	function calcItemPlace(ulBarW, ws, order, colGap, fIdx) {
		const inBar = new Array(ws.length);
		const sumW  = ws.reduce((s, v) => s + v) + (colGap * (ws.length - 1)) - (ws[fIdx] + colGap);

		if (ulBarW < sumW) {
			ulBarW -= ws[fIdx];
			inBar[fIdx] = true;

			for (const idx of order) {
				if (idx !== fIdx) {
					ulBarW -= ws[idx] + colGap;
					inBar[idx] = (0 <= ulBarW);
				}
			}
		} else {
			inBar.fill(true);
			inBar[fIdx] = false;
		}
		return inBar;
	}

};
