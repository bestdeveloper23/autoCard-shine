## Prerequisite
Make sure that [Node.js][] is installed. It provides the [npm][] command to [install][] [JavaScript][] [packages][] listed in [package-lock.json][], which is automatically updated whenever [package.json][] or the local [node_modules][] is changed. This project depends on [JavaScript][] package, [Three.js][], version 0.168. [Vite][] 4.5.5 is needed for the deployment of the project through [GitHub Pages][]. [Vite][] version 5 causes error after bundling and minification.

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
npx vite build
npx vite preview
```

If you can see the following

```
  VITE v4.5.5  ready in 86 ms

  ➜  Local:   http://localhost:4173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

press `o` to open <http://localhost:4173> in the default browser.

## For developers

This project is based on the three.js editor code version 158. It should have been created in the following way:

1. create a repository at [GitHub][], for example, <https://github.com/jintonic/shine>
2. `git clone https://github.com/jintonic/shine`
3. `cd shine` and then `npm init` to create [package.json](package.json)
4. `npm i three` to install [Three.js][] in `./node_modules/` folder and to list it as a dependency in [package.json](package.json), Ref. <https://threejs.org/docs/#manual/en/introduction/Installation>
5. copy files from <https://github.com/mrdoob/three.js/tree/dev/editor>
  - no need to get `manifest.json`, as its contents can be included in [package.json](package.json)
  - no need to get `sw.js`, as it is used to cache other files. When we serve the site through [GitHub Pages][], we bundle individual files together and minify the resulting files. `sw.js` only caches the original files, not the bundled, minified files. To remove `sw.js` from Chrome console, go to Application, select "Service workers", and unregister any existing one.
6. `npm i -D vite` to install [Vite][] in `./node_modules/` folder and to list it as a development dependency in [package.json](package.json), and run `npx vite` to serve the files locally
7. run `npx vite build` to bundle and minify the code tree and its dependence into the `dist/` folder (We may need to add `type="module"` to each script included in [index.html](index.html) so that they will also be included in the `dist/` folder.)
8. run `npx vite preview` to serve the `dist/` folder
9. if everything is fine, then commit and push the contents to [GitHub][] (remember to add dist and node_modules to [.gitignore](.gitignore))
10. follow <https://vitejs.dev/guide/static-deploy> to deploy through [GitHub Pages][]

[GitHub]: https://github.com

| three.js | Geant4 |
|----------|--------|
| mesh     | volume |
| geometry | solid  |

### Development environment

For Mac, install <https://github.com/nvm-sh/nvm> (Don't use Homebrew to install it), and then

```sh
nvm install node
nvm use node
npm i
npx vite build
npx vite preview
```

The last two commands can be replaced by `npm run b` and `npm run p`. `b` and `p` are defined in the `scripts` section in [package.json](package.json). One can also run `npm run d` to removed `type="module"` in [index.html](index.html) and serve the website locally for quick development. Note that these scripts only work in Mac and Linux as they use the `sed` command that doesn't exist in Windows.

For Windows, install <https://github.com/coreybutler/nvm-windows> (You may need to check the environment variable setup by yourself), and then

```sh
nvm install latest
nvm use latest
npm i
# if npm i fails to run due to "running scripts is disabled on this system", run:
# Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy Unrestricted
npx vite build --watch
# use --watch to watch the change of files and then open another terminal to run:
npx vite preview
```

For Docker,

```sh
cd /path/to/shine
docker compose run --rm --service-ports sh
npm i
npx vite build --watch
npx vite preview --host
```

The `--host` option is needed for the server inside the container to accept connections from the host browser.

## Files

- [js/Strings.js](js/Strings.js) contains all words on the UI
- [js/Viewport.js](js/Viewport.js) takes care of the setup of the grid
- [js/Sidebar.js](js/Sidebar.js) defines three tabs in the right sidebar
- [js/Sidebar.Scene.js](js/Sidebar.Scene.js) defines object lists and scene background
- [js/Sidebar.Properties.js](js/Sidebar.Properties.js) defines volume, solid, and material tabs in the right sidebar
- [js/Sidebar.Modifies.js](js/Sidebar.MOdifies.js) takes care of the Replicas tab in the right sidebar
- [js/Sidebar.Left.Solids.js](js/Sidebar.Left.Solids.js) takes care of the "SOLID" tab in the left sidebar
- [js/Sidebar.Geometry.BoxGeometry.js](js/Sidebar.Geometry.BoxGeometry.js) takes care of the "SOLID" tab in the right sidebar
- [js/Sidebar.Left.Sources.js](js/Sidebar.Left.Sources.js) takes care of the "SOURCES" tab in the left sidebar
- [js/Sidebar.Source.Properties.js](js/Sidebar.Source.Properties.js) takes care of the source settings in the right sidebar
