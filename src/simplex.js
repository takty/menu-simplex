/**
 * Menu Simplex (Progressively collapsing menu)
 *
 * @author Takuto Yanagida
 * @version 2023-09-21
 */

window['menu_simplex'] = function (id = null, opts = {}) {
	const NS = 'menu-simplex';

	const CLS_CURRENT = 'current';

	const CLS_READY          = 'ready';
	const CLS_HOVER          = 'hover';
	const CLS_HOVER_ANCESTOR = 'hover-ancestor';
	const CLS_ACTIVE         = 'active';
	const CLS_OPENED         = 'opened';

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
	const barLis   = Array.from(ulBar.querySelectorAll(':scope > li'));
	const allLis   = Array.from(ulBar.querySelectorAll(':scope li'));
	const fIdx     = barLis.findIndex(e => e.classList.contains('hamburger'));
	const buttons  = initPopup(ulBar, barLis, autoClose);
	const order    = initOrder(barLis, reversed);

	for (const li of barLis) {
		li.addEventListener('click', () => closeAll(buttons));
	}
	addHoverStateEventListener(allLis, CLS_CURRENT, CLS_HOVER, root, CLS_HOVER_ANCESTOR);

	let skipResize = false;

	let ws = [];
	setTimeout(() => {
		ws = barLis.map(e => e.offsetWidth);
		const rob = new ResizeObserver(() => {
			requestAnimationFrame(() => {
				if (skipResize) {
					skipResize = false;
					return;
				}
				setMaxWidth(root);
				closeAll(buttons);
				alignItems(ws, ulBar, ulFolder, barLis, fIdx, order);
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


	const focusTrap = document.createElement('li');
	focusTrap.className = 'focus-trap';
	focusTrap.tabIndex = 0;
	focusTrap.addEventListener('focus', () => {
		if (curBtns.length) {
			curBtns[0].focus();
		}
	});

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
		popup.style.transform = null;
		adjustPopupInline(curBtns[0].nextElementSibling);

		if (1 === curBtns.length) {
			const ul = ('UL' === popup.tagName) ? popup : popup.getElementsByClassName('UL')?.[0];
			if (ul) {
				ul.appendChild(focusTrap);
			}
		}

		if (true === getStylePropertyBool(root, CP_IS_BG_FIXED)) {
			skipResize = true;
			fixBackground(true);
		}
	}

	function adjustPopupInline(popup) {
		popup.style.transform = null;
		popup.style.maxWidth = null;
		let pr = popup.getBoundingClientRect();
		const rr = root.getBoundingClientRect();
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
			if (curBtns.length) adjustPopupInline(curBtns[0].nextElementSibling);
		}, 200);
		curBtns.pop();

		if (0 === curBtns.length) {
			const ul = ('UL' === popup.tagName) ? popup : popup.getElementsByClassName('UL')?.[0];
			if (ul && focusTrap.parentElement === ul) {
				ul.removeChild(focusTrap);
			}
		}

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
		if (!curBtns.length || !curBtns[0].nextElementSibling) {
			return;
		}
		const bcr = curBtns[0].nextElementSibling.getBoundingClientRect();
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
		const barW = calcBarWidth(ulBar);
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

	function calcBarWidth(ulBar) {
		ulBar.style.width = '0';
		let barW = Math.floor(root.getBoundingClientRect().width);
		if (barW === 0 && root.parentElement) {
			const rps = getComputedStyle(root.parentElement);
			if (rps.display.endsWith('flex')) {
				root.style.flexGrow = 1;
				barW = Math.floor(root.getBoundingClientRect().width);
				root.style.flexGrow = null;
			}
		}
		ulBar.style.width = null;
		return barW;
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
