## Basic Front-end Boilerplate

Lightweight Front-end boilerplate with a bunch of helpful dev/build tasks. 

#### Key features :

  - ES6 module support using [babel] and [browserify].
  - [SASS] for CSS preprocessing and [autoprefixer] post processor.
  - [Browsersync] for serving the site locally, with auto reloads on file changes.

#### Installation :

Need to have node.js, NPM, and Gulp installed before moving ahead.

```sh
$ git@git.assembla.com:inventiv/manny-award-microsite-miracle-worker.git
$ cd manny-award-microsite-miracle-worker
$ npm install
```

#### Instructions :

To begin serving the site at localhost:3000, with live reload:

```sh
gulp serve
```

Or if you prefer to build manually:

```sh
gulp build
```

#### License :
MIT

[browserify]: <http://browserify.org>
[babel]: <https://babeljs.io/>
[SASS]: <http://sass-lang.com/>
[autoprefixer]: <https://github.com/postcss/autoprefixer>
[Browsersync]: <https://www.browsersync.io>
   
  