var sketch = require('sketch');

const selectedLayers = context.selection;
const selectedCount = selectedLayers.length;

if (selectedCount === 0) {
    context.document.showMessage('Nothing selected..');
} else {
    var outputString = sketch.UI.getStringFromUser('Type commando', '');
    interpret(outputString);
}
/*
copiedWidth = Math.round(frame.width());
	copiedHeight = Math.round(frame.height());
	copiedX = Math.round(layer.absoluteRect().rulerX());
    copiedY = Math.round(layer.absoluteRect().rulerY());
    */

function interpret(input) {
    var parameters = input.split(/(?=[a-z])/);
    var extraParameters = [];
    for (var i = 0; i<parameters.length; i++) {
        if (parameters[i].length === 1) {
            extraParameters.push(parameters[i]);
        } else {
            var value;
            if (isNaN(parameters[i].substring(1))) {
                var tokens = parameters[i].substring(1).split(/([\+\-\*\/])/);
                context.document.showMessage('tokens: '+tokens);
                value = operate(tokens[1], Number(tokens[0]), Number(tokens[2]));
            } else {
                var valueToAnalyse = parameters[i].substring(1);
                var operator = valueToAnalyse.charAt(0);
                if (operator === '+' || operator === '-' || operator === '*' || operator == '/') {
                    // if starts with an operator
                    context.document.showMessage('toTranslate: '+parameters[i].charAt(0)+ ' operator: ' +operator+ ' value: '+valueToAnalyse.substring(1));
                    translateFromOriginalValue(parameters[i].charAt(0), operator, valueToAnalyse.substring(1));
                    break;
                } else {
                    // If it's just a number
                    value = Number(valueToAnalyse);
                }
            }

            if (extraParameters.length !== 0) {
                for (var j = 0; j<extraParameters.length; j++) {
                    translate(extraParameters[j], value);
                }
            }
            var toTranslate = parameters[i].charAt(0);
            translate(toTranslate, value);
        }
    }
    context.document.reloadInspector();
}

function translate(toTranselate, value) {
    toTranselate = toTranselate.toLowerCase();
    //context.document.showMessage('value: '+value);

    if (toTranselate === 'x') {
        for (y = 0; y<context.selection.length; y++) {
            layer = context.selection[y];
            layer.absoluteRect().setRulerX(value);
        }
    }

    else if (toTranselate === 'y') {
        for (y = 0; y<context.selection.length; y++) {
            layer = context.selection[y];
            layer.absoluteRect().setRulerY(value);
        }
    }

    else if (toTranselate === 'w') {
        for (y = 0; y<context.selection.length; y++) {
            layer = context.selection[y];
            frame = layer.frame();
            frame.setWidth(value);
        }
    }

    else if (toTranselate === 'h') {
        for (y = 0; y<context.selection.length; y++) {
            layer = context.selection[y];
            frame = layer.frame();
            frame.setHeight(value);
        }
    }
}

function translateFromOriginalValue(toTranslate, operator, value) {
    value = Number(value);
    for (y = 0; y<context.selection.length; y++) {
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

function rawTranslate() {

}

function operate(operator, prefix, suffix) {

    if (operator === '+') {
        return prefix + suffix;
    }

    else if (operator === '-') {
        return prefix - suffix;
    }

    else if (operator === '*') {
        return prefix * suffix;
    }

    else if (operator === '/') {
        return prefix / suffix;
    }
}




