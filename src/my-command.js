var sketch = require('sketch');

const selectedLayers = context.selection;
const selectedCount = selectedLayers.length;

if (selectedCount === 0) {
    context.document.showMessage('Nothing selected..');
} else {
    var outputString = sketch.UI.getStringFromUser('Type commando', '');
    interpret(outputString);
}

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
                value = operate(tokens[1], Number(tokens[0]), Number(tokens[2]));
            } else {
                value = Number(parameters[i].substring(1));
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




