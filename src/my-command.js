var sketch = require('sketch');
var doc = context.document;
var selection = context.selection;
//var document = sketch.getSelectedDocument();
context.document.showMessage('hello');
const selectedLayers = context.selection;
const selectedCount = selectedLayers.length;

if (selectedCount === 0) {
    context.document.showMessage('No layers are selected.');
} else {

    var outputString = sketch.UI.getStringFromUser('Type command', 'default');
    interpret(outputString);
}

function interpret(input) {
    var parameters = input.split(/(?=[a-z])/);
    var y;
    var frame;
    var layer;
    var extraParameters = [];
    context.document.showMessage(parameters);
    for (var i = 0; i<parameters.length; i++) {
        if (parameters[i].length === 1) {
            context.document.showMessage('multiple commandX: '+parameters);
            extraParameters.push(parameters[i]);

        } else {
            var value = Number(parameters[i].substring(1));

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




