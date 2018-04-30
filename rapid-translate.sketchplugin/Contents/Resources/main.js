/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var _client = __webpack_require__(1);

var _client2 = _interopRequireDefault(_client);

__webpack_require__(2);

var _dom = __webpack_require__(7);

var _dom2 = _interopRequireDefault(_dom);

var _sketchModuleWebView = __webpack_require__(8);

var _sketchModuleWebView2 = _interopRequireDefault(_sketchModuleWebView);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var document = _dom2['default'].getSelectedDocument();
var page = document.selectedPage;
var selectedLayers = context.selection;
var selectedCount = selectedLayers.length;

function interpret(form) {
    inputInterpreter(form.syntax.value);
}

function inputInterpreter(input) {
    var parameters = input.split(/(?=[a-z])/);
    var extraParameters = [];
    var isRaw = false;
    for (var i = 0; i < parameters.length; i++) {
        if (parameters[i].length === 1) {
            extraParameters.push(parameters[i]);
        } else {
            var toTranslate = parameters[i].charAt(0);
            var value;
            if (isNaN(parameters[i].substring(1)) || parameters[i].charAt(1) === '+' || parameters[i].charAt(1) === '-') {
                var tokens = parameters[i].substring(1).split(/([\+\-\*\/])/);
                context.document.showMessage('tokens: ' + tokens[1]);

                if (tokens[1] === '+' || tokens[1] === '-' || tokens[1] === '*' || tokens[1] === '/') {
                    // Raw translation
                    if (extraParameters.length !== 0) {
                        for (var j = 0; j < extraParameters.length; j++) {
                            translateFromOriginalValue(extraParameters[j], tokens[1], tokens[2]);
                        }
                    }
                    translateFromOriginalValue(toTranslate, tokens[1], tokens[2]);
                    isRaw = true;
                } else {
                    // NEW translations
                    value = operate(tokens[1], Number(tokens[0]), Number(tokens[2]));
                    isRaw = false;
                }
            } else {
                var valueToAnalyse = parameters[i].substring(1);
                var operator = valueToAnalyse.charAt(0);

                // If it's just a number
                value = Number(valueToAnalyse);
            }
            if (!isRaw) {
                // Protect from direct operations
                if (extraParameters.length !== 0) {
                    for (var j = 0; j < extraParameters.length; j++) {
                        translate(extraParameters[j], value);
                    }
                }

                translate(toTranslate, value);
            }
        }
    }
    context.document.reloadInspector();
}

function translate(toTranselate, value) {
    toTranselate = toTranselate.toLowerCase();
    for (y = 0; y < context.selection.length; y++) {
        layer = context.selection[y];
        frame = layer.frame();
        if (toTranselate === 'x') {
            layer.absoluteRect().setRulerX(value);
        } else if (toTranselate === 'y') {
            layer.absoluteRect().setRulerY(value);
        } else if (toTranselate === 'w') {
            frame.setWidth(value);
        } else if (toTranselate === 'h') {
            frame.setHeight(value);
        }
    }
}

function translateFromOriginalValue(toTranslate, operator, value) {
    value = Number(value);
    for (y = 0; y < context.selection.length; y++) {
        context.document.showMessage('function');
        layer = context.selection[y];
        frame = layer.frame();
        // Copying original values
        copiedW = Math.round(frame.width());
        copiedH = Math.round(frame.height());
        copiedX = Math.round(layer.absoluteRect().rulerX());
        copiedY = Math.round(layer.absoluteRect().rulerY());
        var value;

        if (toTranslate === 'x') {
            if (operator === '+') {
                value = Number(copiedX) + value;
            } else if (operator === '-') {
                value = Number(copiedX) - value;
            } else if (operator === '*') {
                value = Number(copiedX) * value;
            } else if (operator === '/') {
                value = Number(copiedX) / value;
            } else {
                // Break out if no operator match
                break;
            }
            layer.absoluteRect().setRulerX(value);
        } else if (toTranslate === 'y') {
            if (operator === '+') {
                value = Number(copiedY) + value;
            } else if (operator === '-') {
                value = Number(copiedY) - value;
            } else if (operator === '*') {
                value = Number(copiedY) * value;
            } else if (operator === '/') {
                value = Number(copiedY) / value;
            } else {
                // Break out if no operator match
                break;
            }
            layer.absoluteRect().setRulerY(value);
        } else if (operator === 'w') {
            if (operator === '+') {
                value = Number(copiedW) + value;
            } else if (operator === '-') {
                value = Number(copiedW) - value;
            } else if (operator === '*') {
                value = Number(copiedW) * value;
            } else if (operator === '/') {
                value = Number(copiedW) / value;
            } else {
                // Break out if no operator match
                break;
            }
            frame.setWidth(value);
        } else if (operator === 'h') {
            if (operator === '+') {
                value = Number(copiedH) + value;
            } else if (operator === '-') {
                value = Number(copiedH) - value;
            } else if (operator === '*') {
                value = Number(copiedH) * value;
            } else if (operator === '/') {
                value = Number(copiedH) / value;
            } else {
                // Break out if no operator match
                break;
            }
            frame.setHeight(value);
        }
    }
    context.document.reloadInspector();
}

function operate(operator, prefix, suffix) {

    if (operator === '+') {
        return prefix + suffix;
    } else if (operator === '-') {
        return prefix - suffix;
    } else if (operator === '*') {
        return prefix * suffix;
    } else if (operator === '/') {
        return prefix / suffix;
    }
}

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = function (actionName) {
  if (!actionName) {
    throw new Error('missing action name');
  }
  var args = [].slice.call(arguments).slice(1);
  var previousHash = window.location.hash.split('?')[1] ? window.location.hash.split('?')[0] : window.location.hash;
  window.location.hash = previousHash + '?pluginAction=' + encodeURIComponent(actionName) + '&actionId=' + Date.now() + '&pluginArgs=' + encodeURIComponent(JSON.stringify(args));
  return;
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(3);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(5)(content, options);

if(content.locals) module.exports = content.locals;

if(false) {
	module.hot.accept("!!../node_modules/css-loader/index.js!./style.css", function() {
		var newContent = require("!!../node_modules/css-loader/index.js!./style.css");

		if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));

		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

		update(newContent);
	});

	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(4)(false);
// imports


// module
exports.push([module.i, "/* some default styles to make the view more native like */\n\nhtml {\n  box-sizing: border-box;\n  background: transparent;\n\n  /* Prevent the page to be scrollable */\n  overflow: hidden;\n\n  /* Force the default cursor, even on text */\n  cursor: default;\n}\n\nbody {\n  font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif\n}\n\nh5 {\n  display: inline;\n}\n\nlabel {\n  color: red;\n  transform: translateX(200%);\n}\n\n.form-control {\n  display: inline-block;\n  width: 100px;\n  padding: 10px;\n}\n\n.form-container {\n  height: 100%;\n  width: 100%;\n  padding: 20px 50px 20px 50px;\n}", ""]);

// exports


/***/ }),
/* 4 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function (useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if (item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function (modules, mediaQuery) {
		if (typeof modules === "string") modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for (var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if (typeof id === "number") alreadyImportedModules[id] = true;
		}
		for (i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if (typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if (mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if (mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */';
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getTarget = function (target) {
  return document.querySelector(target);
};

var getElement = (function (fn) {
	var memo = {};

	return function(target) {
                // If passing function in options, then use it for resolve "head" element.
                // Useful for Shadow Root style i.e
                // {
                //   insertInto: function () { return document.querySelector("#foo").shadowRoot }
                // }
                if (typeof target === 'function') {
                        return target();
                }
                if (typeof memo[target] === "undefined") {
			var styleTarget = getTarget.call(this, target);
			// Special case to return head of iframe instead of iframe itself
			if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[target] = styleTarget;
		}
		return memo[target]
	};
})();

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(6);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
        if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 6 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
	// get current location
	var location = typeof window !== "undefined" && window.location;

	if (!location) {
		throw new Error("fixUrls requires window.location");
	}

	// blank or null?
	if (!css || typeof css !== "string") {
		return css;
	}

	var baseUrl = location.protocol + "//" + location.host;
	var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
 This regular expression is just a way to recursively match brackets within
 a string.
 	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
    (  = Start a capturing group
      (?:  = Start a non-capturing group
          [^)(]  = Match anything that isn't a parentheses
          |  = OR
          \(  = Match a start parentheses
              (?:  = Start another non-capturing groups
                  [^)(]+  = Match anything that isn't a parentheses
                  |  = OR
                  \(  = Match a start parentheses
                      [^)(]*  = Match anything that isn't a parentheses
                  \)  = Match a end parentheses
              )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
  \)  = Match a close parens
 	 /gi  = Get all matches, not the first.  Be case insensitive.
  */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function (fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl.trim().replace(/^"(.*)"$/, function (o, $1) {
			return $1;
		}).replace(/^'(.*)'$/, function (o, $1) {
			return $1;
		});

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(unquotedOrigUrl)) {
			return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
			//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("sketch/dom");

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

/* globals NSUUID NSThread NSPanel NSMakeRect NSTexturedBackgroundWindowMask NSTitledWindowMask NSWindowTitleHidden NSClosableWindowMask NSColor NSWindowMiniaturizeButton NSWindowZoomButton NSFloatingWindowLevel WebView COScript NSWindowCloseButton NSFullSizeContentViewWindowMask NSVisualEffectView NSAppearance NSAppearanceNameVibrantLight NSVisualEffectBlendingModeBehindWindow NSLayoutConstraint NSLayoutRelationEqual NSLayoutAttributeLeft NSLayoutAttributeTop NSLayoutAttributeRight NSLayoutAttributeBottom NSResizableWindowMask */
var MochaJSDelegate = __webpack_require__(9);
var parseQuery = __webpack_require__(10);

var coScript = COScript.currentCOScript();

var LOCATION_CHANGED = 'webView:didChangeLocationWithinPageForFrame:';

function addEdgeConstraint(edge, subview, view, constant) {
  view.addConstraint(NSLayoutConstraint.constraintWithItem_attribute_relatedBy_toItem_attribute_multiplier_constant(subview, edge, NSLayoutRelationEqual, view, edge, 1, constant));
}
function fitSubviewToView(subview, view, constants) {
  subview.setTranslatesAutoresizingMaskIntoConstraints(false);

  addEdgeConstraint(NSLayoutAttributeLeft, subview, view, constants[0]);
  addEdgeConstraint(NSLayoutAttributeTop, subview, view, constants[1]);
  addEdgeConstraint(NSLayoutAttributeRight, subview, view, constants[2]);
  addEdgeConstraint(NSLayoutAttributeBottom, subview, view, constants[3]);
}

function WebUI(context, frameLocation, options) {
  options = options || {};
  var identifier = options.identifier || NSUUID.UUID().UUIDString();
  var threadDictionary = NSThread.mainThread().threadDictionary();

  var panel;
  var webView;

  // if we already have a panel opened, reuse it
  if (threadDictionary[identifier]) {
    panel = threadDictionary[identifier];
    panel.makeKeyAndOrderFront(null);

    var subviews = panel.contentView().subviews();
    for (var i = 0; i < subviews.length; i++) {
      if (subviews[i].isKindOfClass(WebView.class())) {
        webView = subviews[i];
      }
    }

    if (!webView) {
      throw new Error('Tried to reuse panel but couldn\'t find the webview inside');
    }

    return {
      panel: panel,
      eval: webView.stringByEvaluatingJavaScriptFromString,
      webView: webView
    };
  }

  panel = NSPanel.alloc().init();

  // Window size
  var panelWidth = options.width || 240;
  var panelHeight = options.height || 180;
  panel.setFrame_display(NSMakeRect(options.x || 0, options.y || 0, panelWidth, panelHeight), true);

  // Titlebar
  panel.setTitle(options.title || context.plugin.name());
  if (options.hideTitleBar) {
    panel.setTitlebarAppearsTransparent(true);
    panel.setTitleVisibility(NSWindowTitleHidden);
  }

  // Hide minize and zoom buttons
  if (options.onlyShowCloseButton) {
    panel.standardWindowButton(NSWindowMiniaturizeButton).setHidden(true);
    panel.standardWindowButton(NSWindowZoomButton).setHidden(true);
  }

  // Close window callback
  var closeButton = panel.standardWindowButton(NSWindowCloseButton);
  function closeHandler() {
    if (options.onPanelClose) {
      var result = options.onPanelClose();
      if (result === false) {
        return;
      }
    }
    panel.close();
    threadDictionary.removeObjectForKey(options.identifier);
    coScript.setShouldKeepAround(false);
  }

  closeButton.setCOSJSTargetFunction(closeHandler);
  closeButton.setAction('callAction:');

  panel.setStyleMask(options.styleMask || (options.resizable ? NSTexturedBackgroundWindowMask | NSTitledWindowMask | NSResizableWindowMask | NSClosableWindowMask | NSFullSizeContentViewWindowMask : NSTexturedBackgroundWindowMask | NSTitledWindowMask | NSClosableWindowMask | NSFullSizeContentViewWindowMask));
  panel.becomeKeyWindow();
  panel.setLevel(NSFloatingWindowLevel);

  // Appearance
  var backgroundColor = options.background || NSColor.whiteColor();
  panel.setBackgroundColor(backgroundColor);
  if (options.blurredBackground) {
    var vibrancy = NSVisualEffectView.alloc().initWithFrame(NSMakeRect(0, 0, panelWidth, panelHeight));
    vibrancy.setAppearance(NSAppearance.appearanceNamed(NSAppearanceNameVibrantLight));
    vibrancy.setBlendingMode(NSVisualEffectBlendingModeBehindWindow);

    // Add it to the panel
    panel.contentView().addSubview(vibrancy);
    fitSubviewToView(vibrancy, panel.contentView(), [0, 0, 0, 0]);
  }

  threadDictionary[identifier] = panel;

  if (options.shouldKeepAround !== false) {
    // Long-running script
    coScript.setShouldKeepAround(true);
  }

  // Add Web View to window
  webView = WebView.alloc().initWithFrame(NSMakeRect(0, options.hideTitleBar ? -24 : 0, options.width || 240, (options.height || 180) - (options.hideTitleBar ? 0 : 24)));

  if (options.frameLoadDelegate || options.handlers) {
    var handlers = options.frameLoadDelegate || {};
    if (options.handlers) {
      var lastQueryId;
      handlers[LOCATION_CHANGED] = function (webview, frame) {
        var query = webview.windowScriptObject().evaluateWebScript('window.location.hash');
        query = parseQuery(query);
        if (query.pluginAction && query.actionId && query.actionId !== lastQueryId && query.pluginAction in options.handlers) {
          lastQueryId = query.actionId;
          try {
            query.pluginArgs = JSON.parse(query.pluginArgs);
          } catch (err) {}
          options.handlers[query.pluginAction].apply(context, query.pluginArgs);
        }
      };
    }
    var frameLoadDelegate = new MochaJSDelegate(handlers);
    webView.setFrameLoadDelegate_(frameLoadDelegate.getClassInstance());
  }
  if (options.uiDelegate) {
    var uiDelegate = new MochaJSDelegate(options.uiDelegate);
    webView.setUIDelegate_(uiDelegate.getClassInstance());
  }

  if (!options.blurredBackground) {
    webView.setOpaque(true);
    webView.setBackgroundColor(backgroundColor);
  } else {
    // Prevent it from drawing a white background
    webView.setDrawsBackground(false);
  }

  // When frameLocation is a file, prefix it with the Sketch Resources path
  if (/^(?!http|localhost|www|file).*\.html?$/.test(frameLocation)) {
    frameLocation = context.plugin.urlForResourceNamed(frameLocation).path();
  }
  webView.setMainFrameURL_(frameLocation);

  panel.contentView().addSubview(webView);
  fitSubviewToView(webView, panel.contentView(), [0, options.hideTitleBar ? 0 : 24, 0, 0]);

  panel.center();
  panel.makeKeyAndOrderFront(null);

  return {
    panel: panel,
    eval: webView.stringByEvaluatingJavaScriptFromString,
    webView: webView,
    close: closeHandler
  };
}

WebUI.clean = function () {
  coScript.setShouldKeepAround(false);
};

module.exports = WebUI;

/***/ }),
/* 9 */
/***/ (function(module, exports) {

/* globals NSUUID MOClassDescription NSObject NSSelectorFromString NSClassFromString */

module.exports = function (selectorHandlerDict, superclass) {
  var uniqueClassName = 'MochaJSDelegate_DynamicClass_' + NSUUID.UUID().UUIDString();

  var delegateClassDesc = MOClassDescription.allocateDescriptionForClassWithName_superclass_(uniqueClassName, superclass || NSObject);

  delegateClassDesc.registerClass();

  // Storage Handlers
  var handlers = {};

  // Define interface
  this.setHandlerForSelector = function (selectorString, func) {
    var handlerHasBeenSet = selectorString in handlers;
    var selector = NSSelectorFromString(selectorString);

    handlers[selectorString] = func;

    /*
      For some reason, Mocha acts weird about arguments: https://github.com/logancollins/Mocha/issues/28
      We have to basically create a dynamic handler with a likewise dynamic number of predefined arguments.
    */
    if (!handlerHasBeenSet) {
      var args = [];
      var regex = /:/g;
      while (regex.exec(selectorString)) {
        args.push('arg' + args.length);
      }

      var dynamicFunction = eval('(function (' + args.join(', ') + ') { return handlers[selectorString].apply(this, arguments); })');

      delegateClassDesc.addInstanceMethodWithSelector_function_(selector, dynamicFunction);
    }
  };

  this.removeHandlerForSelector = function (selectorString) {
    delete handlers[selectorString];
  };

  this.getHandlerForSelector = function (selectorString) {
    return handlers[selectorString];
  };

  this.getAllHandlers = function () {
    return handlers;
  };

  this.getClass = function () {
    return NSClassFromString(uniqueClassName);
  };

  this.getClassInstance = function () {
    return NSClassFromString(uniqueClassName).new();
  };

  // Convenience
  if (typeof selectorHandlerDict === 'object') {
    for (var selectorString in selectorHandlerDict) {
      this.setHandlerForSelector(selectorString, selectorHandlerDict[selectorString]);
    }
  }
};

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = function (query) {
  query = query.split('?')[1];
  if (!query) {
    return;
  }
  query = query.split('&').reduce(function (prev, s) {
    var res = s.split('=');
    if (res.length === 2) {
      prev[decodeURIComponent(res[0])] = decodeURIComponent(res[1]);
    }
    return prev;
  }, {});
  return query;
};

/***/ })
/******/ ]);