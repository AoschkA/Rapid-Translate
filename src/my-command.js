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

function onTranslate(context) {
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
}

function interpret(input) {
    var calculations = input.split(/(?=[a-z])/);
    var y;
    var frame;
    var layer;
    context.document.showMessage(calculations);
    for (var i = 0; i<calculations.length; i++) {

        if (calculations[i].charAt(0) === 'x') {
            for (y = 0; y<context.selection.length; y++) {
                layer = context.selection[y];
                layer.absoluteRect().setRulerX(Number(calculations[i].substring(1)));
            }
        }

        else if (calculations[i].charAt(0) === 'y') {
            for (y = 0; y<context.selection.length; y++) {
                layer = context.selection[y];
                layer.absoluteRect().setRulerY(Number(calculations[i].substring(1)));
            }
        }

        else if (calculations[i].charAt(0) === 'w') {
            for (y = 0; y<context.selection.length; y++) {
                layer = context.selection[y];
                frame = layer.frame();
                frame.setWidth(Number(calculations[i].substring(1)));
            }
        }

        else if (calculations[i].charAt(0) === 'h') {
            for (y = 0; y<context.selection.length; y++) {
                layer = context.selection[y];
                frame = layer.frame();
                frame.setHeight(Number(calculations[i].substring(1)));
            }
        }
    }
    context.document.reloadInspector();
}




