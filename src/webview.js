/* eslint-disable no-new */
import sketch from "sketch/dom";
import WebUI from "sketch-module-web-view";

const document = sketch.getSelectedDocument();
const page = document.selectedPage;

export default function(context) {
  const selectedLayers = context.selection;
  const selectedCount = selectedLayers.length;

  if (selectedCount === 0) {
    context.document.showMessage("Nothing selected..");
  } else {
    new WebUI(context, require("../resources/index.html"), {
      identifier: "rapid-translate",
      x: 0,
      y: 0,
      width: 500,
      height: 300,
      blurredBackground: true,
      onlyShowCloseButton: true,
      hideTitleBar: false,
      shouldKeepAround: true,
      resizable: false
    });
  }
}
