var sketch = require('sketch');

const selectedLayers = context.selection;
const selectedCount = selectedLayers.length;

if (selectedCount === 0) {
    context.document.showMessage('Nothing selected..');
} else {
    var outputString = sketch.UI.getStringFromUser('Type commando', '');
    interpret(outputString);
}

/**
 * Interprets the input - the programs main function
 * 
 * RAW translation uses the original value of the element. 
 * NEW translation sets the value
 * 
 * @param {any} input 
 */
function interpret(input) {
    var parameters = input.split(/(?=[a-z])/);
    var extraParameters = [];
    var isRaw = false;
    for (var i = 0; i < parameters.length; i++) {
        if (parameters[i].length === 1) {
            extraParameters.push(parameters[i]);
        } else {
            var toTranslate = parameters[i].charAt(0);
            var value;
            if (isNaN(parameters[i].substring(1)) || parameters[i].charAt(1) === '+' ||  parameters[i].charAt(1) === '-') {
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