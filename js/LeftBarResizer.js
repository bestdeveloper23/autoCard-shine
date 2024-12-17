import { UIElement } from "./libs/ui.js";

function LeftBarResizer(editor) {
  const signals = editor.signals;

  const dom = document.createElement("div");
  dom.id = "leftbar-resizer";

  function onPointerDown(event) {
    if (event.isPrimary === false) return;

    dom.ownerDocument.addEventListener("pointermove", onPointerMove);
    dom.ownerDocument.addEventListener("pointerup", onPointerUp);
  }

  function onPointerUp(event) {
    if (event.isPrimary === false) return;

    dom.ownerDocument.removeEventListener("pointermove", onPointerMove);
    dom.ownerDocument.removeEventListener("pointerup", onPointerUp);
  }

  function onPointerMove(event) {
    // PointerEvent's movementX/movementY are 0 in WebKit

    if (event.isPrimary === false) return;

    const offsetWidth = document.body.offsetWidth;
    const clientX = event.clientX;
    const leftbarLimit = offsetWidth / 2;

    const cX =
      clientX < 0 ? 0 : clientX > leftbarLimit ? leftbarLimit : clientX;

    const x = Math.max(200, cX); // .TabbedPanel min-width: 200px

    dom.style.left = x + "px";

    document.getElementById("leftbar").style.width = x + "px";
    document.getElementById("player").style.left = x + "px";
    document.getElementById("script").style.left = x + "px";
    document.getElementById("viewport").style.left = x + "px";
    document.getElementById("toolbar").style.left = x + "px";

    const sidebarWidth = document.getElementById("sidebar").style.width;
    document.getElementById("player").style.width =
      "calc(100% - " + sidebarWidth + " - " + x + "px)";
    document.getElementById("viewport").style.width =
      "calc(100% - " + sidebarWidth + " - " + x + "px)";

    signals.windowResize.dispatch();
  }

  dom.addEventListener("pointerdown", onPointerDown);

  return new UIElement(dom);
}

export { LeftBarResizer };
