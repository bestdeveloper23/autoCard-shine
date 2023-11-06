FoG - Frontend of Geant4，一个基于网页的，运行Geant4的前端

它包含两个基本组份：

1. 处理两种语言的在线文本编辑器
  - [Geant4几何描述](https://geant4.web.cern.ch/sites/geant4.web.cern.ch/files/geant4/collaboration/working_groups/geometry/docs/textgeom/textgeom.pdf)
  - [Geant4宏命令](https://geant4-userdoc.web.cern.ch/UsersGuides/ForApplicationDeveloper/html/Control/AllResources/Control/UIcommands/_.html)
2. 两种在线3D显示Geant4几何结构的方法：
  - 基于[Qt WebAssembly][]
  - 基于[HepRepXML][]

[Qt WebAssembly]: https://www.qt.io/qt-examples-for-webassembly
[HepRepXML]: https://www.slac.stanford.edu/~perl/heprepxml/HepRepXMLWriter.html
