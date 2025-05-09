import { UITabbedPanel, UISpan } from "./libs/ui.js";

import {SidebarSceneTool} from './Sidebar.Scene.Tools.js';
import { SidebarScene } from "./Sidebar.Scene.js";
import { SidebarProperties } from "./Sidebar.Properties.js";
import { SidebarAnimation } from "./Sidebar.Animation.js";
import { SidebarProject } from "./Sidebar.Project.js";
import { SidebarSettings } from "./Sidebar.Settings.js";
import { SidebarModify } from "./Sidebar.Modify.js";

function Sidebar(editor) {
  const container = new UITabbedPanel();
  container.setId("sidebar");

  const scene = new UISpan().add(
    new SidebarSceneTool(editor),
    new SidebarScene(editor),
    new SidebarProperties(editor),
    new SidebarAnimation(editor),
    new SidebarModify(editor)
  );
  const project = new SidebarProject(editor);
  const settings = new SidebarSettings(editor);

  const strings = editor.strings;
  container.addTab("scene", strings.getKey("sidebar/scene"), scene);
  container.addTab("project", strings.getKey("sidebar/project"), project);
  container.addTab("settings", strings.getKey("sidebar/settings"), settings);
  container.select("scene");

  return container;
}

export { Sidebar };
