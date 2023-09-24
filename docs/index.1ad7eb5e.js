// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"a0ZXU":[function(require,module,exports) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SECURE = false;
var HMR_ENV_HASH = "d6ea1d42532a7575";
module.bundle.HMR_BUNDLE_ID = "b26d68c71ad7eb5e";
"use strict";
/* global HMR_HOST, HMR_PORT, HMR_ENV_HASH, HMR_SECURE, chrome, browser, __parcel__import__, __parcel__importScripts__, ServiceWorkerGlobalScope */ /*::
import type {
  HMRAsset,
  HMRMessage,
} from '@parcel/reporter-dev-server/src/HMRServer.js';
interface ParcelRequire {
  (string): mixed;
  cache: {|[string]: ParcelModule|};
  hotData: {|[string]: mixed|};
  Module: any;
  parent: ?ParcelRequire;
  isParcelRequire: true;
  modules: {|[string]: [Function, {|[string]: string|}]|};
  HMR_BUNDLE_ID: string;
  root: ParcelRequire;
}
interface ParcelModule {
  hot: {|
    data: mixed,
    accept(cb: (Function) => void): void,
    dispose(cb: (mixed) => void): void,
    // accept(deps: Array<string> | string, cb: (Function) => void): void,
    // decline(): void,
    _acceptCallbacks: Array<(Function) => void>,
    _disposeCallbacks: Array<(mixed) => void>,
  |};
}
interface ExtensionContext {
  runtime: {|
    reload(): void,
    getURL(url: string): string;
    getManifest(): {manifest_version: number, ...};
  |};
}
declare var module: {bundle: ParcelRequire, ...};
declare var HMR_HOST: string;
declare var HMR_PORT: string;
declare var HMR_ENV_HASH: string;
declare var HMR_SECURE: boolean;
declare var chrome: ExtensionContext;
declare var browser: ExtensionContext;
declare var __parcel__import__: (string) => Promise<void>;
declare var __parcel__importScripts__: (string) => Promise<void>;
declare var globalThis: typeof self;
declare var ServiceWorkerGlobalScope: Object;
*/ var OVERLAY_ID = "__parcel__error__overlay__";
var OldModule = module.bundle.Module;
function Module(moduleName) {
    OldModule.call(this, moduleName);
    this.hot = {
        data: module.bundle.hotData[moduleName],
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept: function(fn) {
            this._acceptCallbacks.push(fn || function() {});
        },
        dispose: function(fn) {
            this._disposeCallbacks.push(fn);
        }
    };
    module.bundle.hotData[moduleName] = undefined;
}
module.bundle.Module = Module;
module.bundle.hotData = {};
var checkedAssets /*: {|[string]: boolean|} */ , assetsToDispose /*: Array<[ParcelRequire, string]> */ , assetsToAccept /*: Array<[ParcelRequire, string]> */ ;
function getHostname() {
    return HMR_HOST || (location.protocol.indexOf("http") === 0 ? location.hostname : "localhost");
}
function getPort() {
    return HMR_PORT || location.port;
}
// eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== "undefined") {
    var hostname = getHostname();
    var port = getPort();
    var protocol = HMR_SECURE || location.protocol == "https:" && !/localhost|127.0.0.1|0.0.0.0/.test(hostname) ? "wss" : "ws";
    var ws = new WebSocket(protocol + "://" + hostname + (port ? ":" + port : "") + "/");
    // Web extension context
    var extCtx = typeof chrome === "undefined" ? typeof browser === "undefined" ? null : browser : chrome;
    // Safari doesn't support sourceURL in error stacks.
    // eval may also be disabled via CSP, so do a quick check.
    var supportsSourceURL = false;
    try {
        (0, eval)('throw new Error("test"); //# sourceURL=test.js');
    } catch (err) {
        supportsSourceURL = err.stack.includes("test.js");
    }
    // $FlowFixMe
    ws.onmessage = async function(event /*: {data: string, ...} */ ) {
        checkedAssets = {} /*: {|[string]: boolean|} */ ;
        assetsToAccept = [];
        assetsToDispose = [];
        var data /*: HMRMessage */  = JSON.parse(event.data);
        if (data.type === "update") {
            // Remove error overlay if there is one
            if (typeof document !== "undefined") removeErrorOverlay();
            let assets = data.assets.filter((asset)=>asset.envHash === HMR_ENV_HASH);
            // Handle HMR Update
            let handled = assets.every((asset)=>{
                return asset.type === "css" || asset.type === "js" && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
            });
            if (handled) {
                console.clear();
                // Dispatch custom event so other runtimes (e.g React Refresh) are aware.
                if (typeof window !== "undefined" && typeof CustomEvent !== "undefined") window.dispatchEvent(new CustomEvent("parcelhmraccept"));
                await hmrApplyUpdates(assets);
                // Dispose all old assets.
                let processedAssets = {} /*: {|[string]: boolean|} */ ;
                for(let i = 0; i < assetsToDispose.length; i++){
                    let id = assetsToDispose[i][1];
                    if (!processedAssets[id]) {
                        hmrDispose(assetsToDispose[i][0], id);
                        processedAssets[id] = true;
                    }
                }
                // Run accept callbacks. This will also re-execute other disposed assets in topological order.
                processedAssets = {};
                for(let i = 0; i < assetsToAccept.length; i++){
                    let id = assetsToAccept[i][1];
                    if (!processedAssets[id]) {
                        hmrAccept(assetsToAccept[i][0], id);
                        processedAssets[id] = true;
                    }
                }
            } else fullReload();
        }
        if (data.type === "error") {
            // Log parcel errors to console
            for (let ansiDiagnostic of data.diagnostics.ansi){
                let stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
                console.error("\uD83D\uDEA8 [parcel]: " + ansiDiagnostic.message + "\n" + stack + "\n\n" + ansiDiagnostic.hints.join("\n"));
            }
            if (typeof document !== "undefined") {
                // Render the fancy html overlay
                removeErrorOverlay();
                var overlay = createErrorOverlay(data.diagnostics.html);
                // $FlowFixMe
                document.body.appendChild(overlay);
            }
        }
    };
    ws.onerror = function(e) {
        console.error(e.message);
    };
    ws.onclose = function() {
        console.warn("[parcel] \uD83D\uDEA8 Connection to the HMR server was lost");
    };
}
function removeErrorOverlay() {
    var overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
        overlay.remove();
        console.log("[parcel] ✨ Error resolved");
    }
}
function createErrorOverlay(diagnostics) {
    var overlay = document.createElement("div");
    overlay.id = OVERLAY_ID;
    let errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';
    for (let diagnostic of diagnostics){
        let stack = diagnostic.frames.length ? diagnostic.frames.reduce((p, frame)=>{
            return `${p}
<a href="/__parcel_launch_editor?file=${encodeURIComponent(frame.location)}" style="text-decoration: underline; color: #888" onclick="fetch(this.href); return false">${frame.location}</a>
${frame.code}`;
        }, "") : diagnostic.stack;
        errorHTML += `
      <div>
        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
          🚨 ${diagnostic.message}
        </div>
        <pre>${stack}</pre>
        <div>
          ${diagnostic.hints.map((hint)=>"<div>\uD83D\uDCA1 " + hint + "</div>").join("")}
        </div>
        ${diagnostic.documentation ? `<div>📝 <a style="color: violet" href="${diagnostic.documentation}" target="_blank">Learn more</a></div>` : ""}
      </div>
    `;
    }
    errorHTML += "</div>";
    overlay.innerHTML = errorHTML;
    return overlay;
}
function fullReload() {
    if ("reload" in location) location.reload();
    else if (extCtx && extCtx.runtime && extCtx.runtime.reload) extCtx.runtime.reload();
}
function getParents(bundle, id) /*: Array<[ParcelRequire, string]> */ {
    var modules = bundle.modules;
    if (!modules) return [];
    var parents = [];
    var k, d, dep;
    for(k in modules)for(d in modules[k][1]){
        dep = modules[k][1][d];
        if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) parents.push([
            bundle,
            k
        ]);
    }
    if (bundle.parent) parents = parents.concat(getParents(bundle.parent, id));
    return parents;
}
function updateLink(link) {
    var href = link.getAttribute("href");
    if (!href) return;
    var newLink = link.cloneNode();
    newLink.onload = function() {
        if (link.parentNode !== null) // $FlowFixMe
        link.parentNode.removeChild(link);
    };
    newLink.setAttribute("href", // $FlowFixMe
    href.split("?")[0] + "?" + Date.now());
    // $FlowFixMe
    link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
    if (cssTimeout) return;
    cssTimeout = setTimeout(function() {
        var links = document.querySelectorAll('link[rel="stylesheet"]');
        for(var i = 0; i < links.length; i++){
            // $FlowFixMe[incompatible-type]
            var href /*: string */  = links[i].getAttribute("href");
            var hostname = getHostname();
            var servedFromHMRServer = hostname === "localhost" ? new RegExp("^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):" + getPort()).test(href) : href.indexOf(hostname + ":" + getPort());
            var absolute = /^https?:\/\//i.test(href) && href.indexOf(location.origin) !== 0 && !servedFromHMRServer;
            if (!absolute) updateLink(links[i]);
        }
        cssTimeout = null;
    }, 50);
}
function hmrDownload(asset) {
    if (asset.type === "js") {
        if (typeof document !== "undefined") {
            let script = document.createElement("script");
            script.src = asset.url + "?t=" + Date.now();
            if (asset.outputFormat === "esmodule") script.type = "module";
            return new Promise((resolve, reject)=>{
                var _document$head;
                script.onload = ()=>resolve(script);
                script.onerror = reject;
                (_document$head = document.head) === null || _document$head === void 0 || _document$head.appendChild(script);
            });
        } else if (typeof importScripts === "function") {
            // Worker scripts
            if (asset.outputFormat === "esmodule") return import(asset.url + "?t=" + Date.now());
            else return new Promise((resolve, reject)=>{
                try {
                    importScripts(asset.url + "?t=" + Date.now());
                    resolve();
                } catch (err) {
                    reject(err);
                }
            });
        }
    }
}
async function hmrApplyUpdates(assets) {
    global.parcelHotUpdate = Object.create(null);
    let scriptsToRemove;
    try {
        // If sourceURL comments aren't supported in eval, we need to load
        // the update from the dev server over HTTP so that stack traces
        // are correct in errors/logs. This is much slower than eval, so
        // we only do it if needed (currently just Safari).
        // https://bugs.webkit.org/show_bug.cgi?id=137297
        // This path is also taken if a CSP disallows eval.
        if (!supportsSourceURL) {
            let promises = assets.map((asset)=>{
                var _hmrDownload;
                return (_hmrDownload = hmrDownload(asset)) === null || _hmrDownload === void 0 ? void 0 : _hmrDownload.catch((err)=>{
                    // Web extension bugfix for Chromium
                    // https://bugs.chromium.org/p/chromium/issues/detail?id=1255412#c12
                    if (extCtx && extCtx.runtime && extCtx.runtime.getManifest().manifest_version == 3) {
                        if (typeof ServiceWorkerGlobalScope != "undefined" && global instanceof ServiceWorkerGlobalScope) {
                            extCtx.runtime.reload();
                            return;
                        }
                        asset.url = extCtx.runtime.getURL("/__parcel_hmr_proxy__?url=" + encodeURIComponent(asset.url + "?t=" + Date.now()));
                        return hmrDownload(asset);
                    }
                    throw err;
                });
            });
            scriptsToRemove = await Promise.all(promises);
        }
        assets.forEach(function(asset) {
            hmrApply(module.bundle.root, asset);
        });
    } finally{
        delete global.parcelHotUpdate;
        if (scriptsToRemove) scriptsToRemove.forEach((script)=>{
            if (script) {
                var _document$head2;
                (_document$head2 = document.head) === null || _document$head2 === void 0 || _document$head2.removeChild(script);
            }
        });
    }
}
function hmrApply(bundle /*: ParcelRequire */ , asset /*:  HMRAsset */ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (asset.type === "css") reloadCSS();
    else if (asset.type === "js") {
        let deps = asset.depsByBundle[bundle.HMR_BUNDLE_ID];
        if (deps) {
            if (modules[asset.id]) {
                // Remove dependencies that are removed and will become orphaned.
                // This is necessary so that if the asset is added back again, the cache is gone, and we prevent a full page reload.
                let oldDeps = modules[asset.id][1];
                for(let dep in oldDeps)if (!deps[dep] || deps[dep] !== oldDeps[dep]) {
                    let id = oldDeps[dep];
                    let parents = getParents(module.bundle.root, id);
                    if (parents.length === 1) hmrDelete(module.bundle.root, id);
                }
            }
            if (supportsSourceURL) // Global eval. We would use `new Function` here but browser
            // support for source maps is better with eval.
            (0, eval)(asset.output);
            // $FlowFixMe
            let fn = global.parcelHotUpdate[asset.id];
            modules[asset.id] = [
                fn,
                deps
            ];
        } else if (bundle.parent) hmrApply(bundle.parent, asset);
    }
}
function hmrDelete(bundle, id) {
    let modules = bundle.modules;
    if (!modules) return;
    if (modules[id]) {
        // Collect dependencies that will become orphaned when this module is deleted.
        let deps = modules[id][1];
        let orphans = [];
        for(let dep in deps){
            let parents = getParents(module.bundle.root, deps[dep]);
            if (parents.length === 1) orphans.push(deps[dep]);
        }
        // Delete the module. This must be done before deleting dependencies in case of circular dependencies.
        delete modules[id];
        delete bundle.cache[id];
        // Now delete the orphans.
        orphans.forEach((id)=>{
            hmrDelete(module.bundle.root, id);
        });
    } else if (bundle.parent) hmrDelete(bundle.parent, id);
}
function hmrAcceptCheck(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    if (hmrAcceptCheckOne(bundle, id, depsByBundle)) return true;
    // Traverse parents breadth first. All possible ancestries must accept the HMR update, or we'll reload.
    let parents = getParents(module.bundle.root, id);
    let accepted = false;
    while(parents.length > 0){
        let v = parents.shift();
        let a = hmrAcceptCheckOne(v[0], v[1], null);
        if (a) // If this parent accepts, stop traversing upward, but still consider siblings.
        accepted = true;
        else {
            // Otherwise, queue the parents in the next level upward.
            let p = getParents(module.bundle.root, v[1]);
            if (p.length === 0) {
                // If there are no parents, then we've reached an entry without accepting. Reload.
                accepted = false;
                break;
            }
            parents.push(...p);
        }
    }
    return accepted;
}
function hmrAcceptCheckOne(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (depsByBundle && !depsByBundle[bundle.HMR_BUNDLE_ID]) {
        // If we reached the root bundle without finding where the asset should go,
        // there's nothing to do. Mark as "accepted" so we don't reload the page.
        if (!bundle.parent) return true;
        return hmrAcceptCheck(bundle.parent, id, depsByBundle);
    }
    if (checkedAssets[id]) return true;
    checkedAssets[id] = true;
    var cached = bundle.cache[id];
    assetsToDispose.push([
        bundle,
        id
    ]);
    if (!cached || cached.hot && cached.hot._acceptCallbacks.length) {
        assetsToAccept.push([
            bundle,
            id
        ]);
        return true;
    }
}
function hmrDispose(bundle /*: ParcelRequire */ , id /*: string */ ) {
    var cached = bundle.cache[id];
    bundle.hotData[id] = {};
    if (cached && cached.hot) cached.hot.data = bundle.hotData[id];
    if (cached && cached.hot && cached.hot._disposeCallbacks.length) cached.hot._disposeCallbacks.forEach(function(cb) {
        cb(bundle.hotData[id]);
    });
    delete bundle.cache[id];
}
function hmrAccept(bundle /*: ParcelRequire */ , id /*: string */ ) {
    // Execute the module.
    bundle(id);
    // Run the accept callbacks in the new version of the module.
    var cached = bundle.cache[id];
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) cached.hot._acceptCallbacks.forEach(function(cb) {
        var assetsToAlsoAccept = cb(function() {
            return getParents(module.bundle.root, id);
        });
        if (assetsToAlsoAccept && assetsToAccept.length) {
            assetsToAlsoAccept.forEach(function(a) {
                hmrDispose(a[0], a[1]);
            });
            // $FlowFixMe[method-unbinding]
            assetsToAccept.push.apply(assetsToAccept, assetsToAlsoAccept);
        }
    });
}

},{}],"jNfpH":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "menu_simplex", ()=>menu_simplex);
parcelHelpers.export(exports, "MenuSimplex", ()=>MenuSimplex);
function menu_simplex(id = null) {
    new MenuSimplex(id);
}
class Item {
    li;
    btn;
    popup;
    width;
    constructor(li, btn, popup, width){
        this.li = li;
        this.btn = btn;
        this.popup = popup;
        this.width = width;
        this.li = li;
        this.btn = btn;
        this.popup = popup;
        this.width = width;
    }
}
class MenuSimplex {
    static NS = "menu-simplex";
    static CP_IS_FOLDABLE = "--is-foldable";
    static CP_IS_CLOSED_AUTO = "--is-closed-auto";
    static CP_IS_BG_FIXED = "--is-background-fixed";
    static CP_IS_REVERSED = "--is-reversed";
    static CP_FOLDER_POS = "--folder-position";
    static CLS_FOLDER = "folder";
    static CLS_CURRENT = "current";
    static CLS_READY = "ready";
    static CLS_HOVER = "hover";
    static CLS_HOVER_ANCESTOR = "hover-ancestor";
    static CLS_ACTIVE = "active";
    static CLS_OPENED = "opened";
    static CP_MAX_WIDTH = "--max-width";
    static throttle(fn) {
        let isRunning;
        function run() {
            isRunning = false;
            fn();
        }
        return ()=>{
            if (isRunning) return;
            isRunning = true;
            requestAnimationFrame(run);
        };
    }
    static addHoverStateEventListener(root, elms) {
        const enter = (e)=>{
            const li = e.target.parentElement;
            if (li && e.pointerType === "mouse" && !li.classList.contains(MenuSimplex.CLS_CURRENT)) {
                li.classList.add(MenuSimplex.CLS_HOVER);
                for(let elm = li.parentElement; elm && elm !== root; elm = elm.parentElement)if (elm.tagName === "LI") elm.classList.add(MenuSimplex.CLS_HOVER_ANCESTOR);
            }
        };
        const leave = (e)=>{
            const li = e.target.parentElement;
            if (li && e.pointerType === "mouse" && !li.classList.contains(MenuSimplex.CLS_CURRENT)) {
                li.classList.remove(MenuSimplex.CLS_HOVER);
                for(let elm = li.parentElement; elm && elm !== root; elm = elm.parentElement)if (elm.tagName === "LI") elm.classList.remove(MenuSimplex.CLS_HOVER_ANCESTOR);
            }
        };
        for (const it of elms){
            const fec = it.firstElementChild;
            if (fec) {
                fec.addEventListener("pointerenter", enter);
                fec.addEventListener("pointerleave", leave);
            }
        }
    }
    static fixed;
    static fixBackground(enabled) {
        if (MenuSimplex.fixed === enabled) return;
        MenuSimplex.fixed = enabled;
        const scrollingElement = ()=>{
            return "scrollingElement" in document ? document.scrollingElement : document.documentElement;
        };
        const se = scrollingElement();
        if (!se) return;
        const sy = enabled ? se.scrollTop : parseInt(document.body.style.top ?? "0");
        const cs = getComputedStyle(document.body);
        const mw = parseFloat(cs.marginInlineStart) + parseFloat(cs.marginInlineEnd);
        const ss = {
            position: "fixed",
            top: `${-sy}px`,
            left: "0",
            width: `calc(100vw - ${mw}px)`,
            height: "100dvh",
            "overflow-y": "scroll"
        };
        for (const [key, value] of Object.entries(ss))document.body.style[key] = enabled ? value : "";
        if (!enabled) window.scrollTo(0, -sy);
    }
    static getStylePropertyBool(elm, prop) {
        const v = getComputedStyle(elm).getPropertyValue(prop).trim();
        if (!v.length) return null;
        if (typeof v !== "string") return Boolean(v);
        try {
            return "true" == JSON.parse(v.toLowerCase());
        } catch (e) {
            return v.length !== 0;
        }
    }
    static getStylePropertyString(elm, prop) {
        const v = getComputedStyle(elm).getPropertyValue(prop).trim().replace(new RegExp('^"+|"+$', "g"), "");
        if (!v.length) return null;
        return typeof v === "string" ? v : String(v);
    }
    #divRoot;
    #ulBar;
    #ulFld;
    #liFocusTrap;
    #fldIdx;
    #scrollY = 0;
    #curIts = [];
    #skipResize = false;
    constructor(id = null){
        const divRoot = id ? document.getElementById(id) : document.getElementsByClassName(MenuSimplex.NS)[0];
        if (!divRoot) throw new DOMException();
        this.#divRoot = divRoot;
        this.#ulBar = this.#divRoot.getElementsByTagName("ul")[0];
        if (!this.#ulBar) throw new DOMException();
        [this.#ulFld, this.#fldIdx] = this.initFolder();
        const its = this.initBarItems();
        this.initPopup(its);
        const order = this.initOrder(its);
        this.#liFocusTrap = this.initFocusTrap();
        const allLis = Array.from(this.#ulBar.querySelectorAll("li"));
        MenuSimplex.addHoverStateEventListener(this.#divRoot, allLis);
        setTimeout(()=>{
            const ro = new ResizeObserver(()=>requestAnimationFrame(()=>{
                    if (this.#skipResize) {
                        this.#skipResize = false;
                        return;
                    }
                    this.closeAll(its);
                    this.alignItems(its, order);
                }));
            ro.observe(this.#divRoot);
            ro.observe(this.#divRoot.parentElement);
        }, 10);
        setTimeout(()=>this.#divRoot.classList.add(MenuSimplex.CLS_READY), 100);
    }
    initFolder() {
        let li = null;
        let idx = 0;
        for (const e of Array.from(this.#ulBar.children)){
            if (e.classList.contains(MenuSimplex.CLS_FOLDER)) {
                li = e;
                break;
            }
            idx += 1;
        }
        if (!li) {
            li = document.createElement("li");
            li.classList.add(MenuSimplex.CLS_FOLDER);
            const pos = MenuSimplex.getStylePropertyString(this.#divRoot, MenuSimplex.CP_FOLDER_POS);
            if (null === pos || "end" === pos) {
                this.#ulBar.append(li);
                idx = this.#ulBar.children.length - 1;
            } else if ("start" === pos) {
                this.#ulBar.prepend(li);
                idx = 0;
            }
        }
        let btn = li.querySelector(":scope > button");
        if (!btn) {
            btn = document.createElement("button");
            li.appendChild(btn);
        }
        let ul = li.querySelector(":scope > button + ul, :scope > button + * > ul");
        if (!ul) {
            ul = document.createElement("ul");
            ul.classList.add("menu");
            li.appendChild(ul);
        }
        return [
            ul,
            idx
        ];
    }
    initBarItems() {
        const its = [];
        const lis = Array.from(this.#ulBar.querySelectorAll(":scope > li"));
        for (const li of lis){
            const btn = li.querySelector(":scope > button");
            const popup = btn?.nextElementSibling;
            const width = li.offsetWidth;
            its.push(new Item(li, btn, popup, width));
        }
        return its;
    }
    initPopup(its) {
        for (const it of its){
            const { li, btn, popup } = it;
            if (!btn || !popup) continue;
            btn.setAttribute("area-expanded", "false");
            if (!popup.id) {
                const id = btn.id ? btn.id : li.id ? li.id : "";
                if (id) popup.id = id + "-sub";
            }
            if (popup.id) btn.setAttribute("area-controls", popup.id);
            btn.addEventListener("click", (e)=>{
                if (btn.classList.contains(MenuSimplex.CLS_OPENED)) this.close(it);
                else {
                    if (this.#ulBar === li.parentElement) this.closeAll(its, btn);
                    this.open(it);
                }
                e.stopPropagation();
            });
        }
        window.addEventListener("keydown", (e)=>{
            if (e.key === "Escape") {
                if (this.#curIts.length) {
                    const { btn } = this.#curIts[this.#curIts.length - 1];
                    if (btn) {
                        btn.focus();
                        btn.click();
                    }
                }
            }
        });
        if (true === MenuSimplex.getStylePropertyBool(this.#divRoot, MenuSimplex.CP_IS_CLOSED_AUTO)) {
            document.addEventListener("DOMContentLoaded", ()=>{
                window.addEventListener("scroll", MenuSimplex.throttle(()=>this.doOnScroll(its)), {
                    passive: true
                });
            });
            document.addEventListener("click", ()=>this.closeAll(its));
        }
    }
    initOrder(its) {
        const ws = new Array(its.length);
        for(let i = 0; i < its.length; i += 1){
            const { li } = its[i];
            ws[i] = this.getWeightFromClass(li, its.length - i);
        }
        const order = new Array(its.length);
        for(let i = 0; i < its.length; i += 1)order[i] = i;
        order.sort((a, b)=>ws[a] < ws[b] ? 1 : ws[a] > ws[b] ? -1 : 0);
        if (true === MenuSimplex.getStylePropertyBool(this.#divRoot, MenuSimplex.CP_IS_REVERSED)) order.reverse();
        return order;
    }
    getWeightFromClass(li, def) {
        const cs = li.className.split(" ");
        let w = null;
        for (const c of cs){
            const n = parseInt(c, 10);
            if (isNaN(n)) continue;
            if (null === w || w < n) w = n;
        }
        return w ?? def;
    }
    initFocusTrap() {
        const e = document.createElement("li");
        e.className = "focus-trap";
        e.tabIndex = 0;
        e.addEventListener("focus", ()=>{
            if (this.#curIts.length) {
                const { btn } = this.#curIts[0];
                if (btn) btn.focus();
            }
        });
        return e;
    }
    open(it) {
        const { li, btn, popup } = it;
        if (!btn || !popup) return;
        li.classList.add(MenuSimplex.CLS_OPENED);
        btn.classList.add(MenuSimplex.CLS_OPENED);
        btn.setAttribute("area-expanded", "true");
        popup.classList.add(MenuSimplex.CLS_ACTIVE);
        setTimeout(()=>popup.classList.add(MenuSimplex.CLS_OPENED), 0);
        this.#curIts.push(it);
        popup.style.transform = "";
        if (this.#curIts[0].popup) this.adjustPopupInline(this.#curIts[0].popup);
        this.#scrollY = window.scrollY;
        if (1 === this.#curIts.length) {
            const ul = "UL" === popup.tagName ? popup : popup.getElementsByClassName("UL")?.[0];
            if (ul) ul.appendChild(this.#liFocusTrap);
        }
        if (true === MenuSimplex.getStylePropertyBool(this.#divRoot, MenuSimplex.CP_IS_BG_FIXED)) {
            this.#skipResize = true;
            MenuSimplex.fixBackground(true);
        }
    }
    adjustPopupInline(popup) {
        popup.style.transform = "";
        popup.style.maxWidth = "";
        let pr = popup.getBoundingClientRect();
        const rr = this.#divRoot.getBoundingClientRect();
        if (rr.width < pr.width) {
            popup.style.maxWidth = `${rr.width}px`;
            pr = popup.getBoundingClientRect();
        }
        if (rr.right < pr.right) popup.style.transform = `translateX(${rr.right - pr.right}px)`;
        if (pr.left < rr.left) popup.style.transform = `translateX(${pr.left - rr.left}px)`;
    }
    close(it) {
        const { li, btn, popup } = it;
        if (!btn || !popup) return;
        li.classList.remove(MenuSimplex.CLS_OPENED);
        btn.classList.remove(MenuSimplex.CLS_OPENED);
        btn.setAttribute("area-expanded", "false");
        popup.classList.remove(MenuSimplex.CLS_OPENED);
        setTimeout(()=>{
            popup.classList.remove(MenuSimplex.CLS_ACTIVE);
            if (this.#curIts.length) {
                const { popup } = this.#curIts[0];
                if (popup) this.adjustPopupInline(popup);
            }
        }, 200);
        this.#curIts.pop();
        if (0 === this.#curIts.length) {
            const ul = "UL" === popup.tagName ? popup : popup.getElementsByClassName("UL")?.[0];
            if (ul && this.#liFocusTrap.parentElement === ul) ul.removeChild(this.#liFocusTrap);
        }
        if (MenuSimplex.getStylePropertyBool(this.#divRoot, MenuSimplex.CP_IS_BG_FIXED)) {
            this.#skipResize = true;
            MenuSimplex.fixBackground(false);
        }
    }
    closeAll(its, opening = null) {
        if (!this.#curIts.length) return;
        for (const it of its){
            const { btn } = it;
            if (btn && opening !== btn) this.close(it);
        }
        this.#curIts.length = 0;
        if (MenuSimplex.getStylePropertyBool(this.#divRoot, MenuSimplex.CP_IS_BG_FIXED)) {
            this.#skipResize = true;
            MenuSimplex.fixBackground(false);
        }
    }
    doOnScroll(its) {
        if (!this.#curIts.length || !this.#curIts[0].popup) return;
        const bcr = this.#curIts[0].popup.getBoundingClientRect();
        if (bcr.bottom < 0 || 0 < bcr.top && bcr.bottom < Math.abs(window.scrollY - this.#scrollY)) this.closeAll(its);
    }
    alignItems(its, order) {
        this.setMaxWidth();
        const inBar = this.calcItemPlace(its, order);
        if (false === MenuSimplex.getStylePropertyBool(this.#divRoot, MenuSimplex.CP_IS_FOLDABLE)) {
            inBar.fill(true);
            inBar[this.#fldIdx] = false;
        }
        its[this.#fldIdx].li.style.display = inBar[this.#fldIdx] ? "" : "none";
        let prevElm = this.#ulBar.firstChild;
        for(let i = 0; i < its.length; i += 1){
            const { li } = its[i];
            if (inBar[i]) {
                if (li.parentElement === this.#ulBar) its[i].width = li.offsetWidth;
                this.#ulBar.insertBefore(li, prevElm.nextElementSibling);
                prevElm = li;
            } else if (i !== this.#fldIdx) this.#ulFld.appendChild(li);
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
        const gap = this.calcBarGap();
        const sumW = its.reduce((s, v)=>s + v.width, 0) + gap * (its.length - 1) - (its[this.#fldIdx].width + gap);
        let barW = this.calcBarWidth();
        if (barW < sumW) {
            barW -= its[this.#fldIdx].width;
            inBar[this.#fldIdx] = true;
            for (const idx of order)if (idx !== this.#fldIdx) {
                barW -= its[idx].width + gap;
                inBar[idx] = 0 <= barW;
            }
        } else {
            inBar.fill(true);
            inBar[this.#fldIdx] = false;
        }
        return inBar;
    }
    calcBarWidth() {
        this.#ulBar.style.width = "0";
        let w = Math.floor(this.#divRoot.getBoundingClientRect().width);
        if (0 === w && this.#divRoot.parentElement) {
            const s = getComputedStyle(this.#divRoot.parentElement);
            if (s.display.endsWith("flex")) {
                this.#divRoot.style.flexGrow = "1";
                w = Math.floor(this.#divRoot.getBoundingClientRect().width);
                this.#divRoot.style.flexGrow = "";
            }
        }
        this.#ulBar.style.width = "";
        return w;
    }
    calcBarGap() {
        const s = getComputedStyle(this.#ulBar);
        const g = parseInt(s.columnGap, 10);
        return Number.isNaN(g) ? 0 : g;
    }
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"gkKU3":[function(require,module,exports) {
exports.interopDefault = function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
};
exports.defineInteropFlag = function(a) {
    Object.defineProperty(a, "__esModule", {
        value: true
    });
};
exports.exportAll = function(source, dest) {
    Object.keys(source).forEach(function(key) {
        if (key === "default" || key === "__esModule" || dest.hasOwnProperty(key)) return;
        Object.defineProperty(dest, key, {
            enumerable: true,
            get: function() {
                return source[key];
            }
        });
    });
    return dest;
};
exports.export = function(dest, destName, get) {
    Object.defineProperty(dest, destName, {
        enumerable: true,
        get: get
    });
};

},{}]},["a0ZXU","jNfpH"], "jNfpH", "parcelRequire1b34")

//# sourceMappingURL=index.1ad7eb5e.js.map
