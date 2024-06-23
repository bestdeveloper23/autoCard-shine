## Prerequisite
Make sure that [Node.js][] is installed. It provides the [npm][] command to [install][] [JavaScript][] [packages][] listed in [package-lock.json][], which is automatically updated whenever [package.json][] or the local [node_modules][] is changed. This project depends on only one [JavaScript][] package, [Three.js][]. [Vite][] is needed for the deployment of the project through [GitHub Pages][].

[Node.js]: https://nodejs.org
[npm]: https://docs.npmjs.com/about-npm
[install]: https://stackoverflow.com/a/50594385
[JavaScript]: https://developer.mozilla.org/en-US/docs/Web/javascript
[packages]: https://docs.npmjs.com/about-the-public-npm-registry
[package.json]: https://www.geeksforgeeks.org/difference-between-package-json-and-package-lock-json-files
[package-lock.json]: https://docs.npmjs.com/cli/v7/configuring-npm/package-lock-json
[node_modules]: https://stackoverflow.com/questions/63294260
[Three.js]: https://threejs.org/manual/#en/fundamentals
[Vite]: https://vitejs.dev/guide/static-deploy
[GitHub Pages]: https://vitejs.dev/guide/static-deploy#github-pages

## Get started

Assume that [Node.js] has been installed, one can use the following commands to check the web page locally:

```sh
git clone https://github.com/jintonic/shine
cd shine
npm i
npx vite
```

If you can see the following

```
  VITE v4.5.0  ready in 86 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

press `o` to open <http://localhost:5173> in the default browser.

## For developers

This project should have been created in the following way:

1. create a repository at [GitHub][], for example, <https://github.com/jintonic/shine>
2. `git clone https://github.com/jintonic/shine`
3. `cd shine` and then `npm init` to create [package.json](package.json)
4. `npm i three` to add [Three.js][] as a dependency in [package.json](package.json), Ref. <https://threejs.org/docs/#manual/en/introduction/Installation>
5. copy files from <https://github.com/mrdoob/three.js/tree/dev/editor>
6. `npm i -d vite` to install [Vite][], and run `npx vite` to serve locally
7. commit everything to [GitHub][]
8. follow <https://vitejs.dev/guide/static-deploy> to deploy through [GitHub Pages][]

[GitHub]: https://github.com

| three.js | Geant4 |
|----------|--------|
| mesh     | volume |
| geometry | solid  |

## Files

- [manifest.json](manifest.json): <https://w3c.github.io/manifest> and <https://deskpro.gitbook.io/deskpro-apps/reference/manifest-package.json>
- [js/Viewport.js](js/Viewport.js): takes care of the setup of the grid
- [js/Sidebar.Left.Solids.js](js/Sidebar.Left.Solids.js): takes care of the "SOLID" tab in the left side bar
- [js/Sidebar.Geometry.BoxGeometry.js](js/Sidebar.Geometry.BoxGeometry.js): takes care of the "SOLID" tab in the right side bar
