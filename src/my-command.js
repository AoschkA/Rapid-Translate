var sketch = require('sketch');
log(sketch.version.api);
log(sketch.version.sketch);

var document = sketch.getSelectedDocument();
var page = document.selectedPage;

var Group = sketch.Group;
var Shape = sketch.Shape;
var Rectangle = sketch.Rectangle;

const selectedLayers = context.selection;
const selectedCount = selectedLayers.length;

if (selectedCount === 0) {
    context.document.showMessage('No layers are selected.');
} else {

    var outputString = sketch.UI.getStringFromUser('HELLO', 'default');
    context.document.showMessage(`${selectedCount} layers selected. `+outputString);

    if (outputString[0] === 'x') {
        var amount = outputString.substring(1);
        context.document.showMessage(amount.toString());
        //var rect = new Rectangle(selectedLayers[0]);
        var newRect = new Shape({
            parent: page,
            frame: new Rectangle(Number(amount), 0, 50, 50),
            style: {
                borders: [{ color: '#000431' }],
            },
        })

    }

}


