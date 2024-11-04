import { UITabbedPanel } from "./libs/ui.js";

import { BasicSolids } from "./Sidebar.Left.Solids.js";
import { BasicSources } from "./Sidebar.Left.Sources.js";

function SidebarLeft(editor) {
  const strings = editor.strings;

  const container = new UITabbedPanel();
  container.setId("leftbar");

  container.addTab(
    "solids",
    strings.getKey("sidebar/left/solids"),
    new BasicSolids(editor)
  );
  container.addTab(
    "sources",
    strings.getKey("sidebar/left/sources"),
    new BasicSources(editor)
  );
  container.select("solids");

  return container;
}

export { SidebarLeft };
