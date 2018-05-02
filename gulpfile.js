const gulp = require('gulp');						// Task manager used to perform all the below tasks.
const del = require('del');							// Delete files and folders on the HD.
const path = require('path');						// handles directory paths assignments.
const buffer = require('gulp-buffer');				// Converts stream to buffer
const source = require('vinyl-source-stream');      // Converts a stream to a virtual file.
const exorcist = require('exorcist');				// Browserify writes js.map to output.js when debug=true. Exorcist pulls it out and creates external output.js.map
const uglify = require('gulp-uglify');				// minimizes code length
const browserify = require('browserify');			// Converts Common.js require modules to vanilla javascript, includes dependency management.
const babelify = require('babelify');				// Converts ES6 javascript schema to browser friendly version.
const browserSync = require('browser-sync');		// Serves site files and performs reloads on file updates
const sass = require('gulp-sass');					// CSS preprocessor for converting SASS to CSS
const sourcemaps = require('gulp-sourcemaps');		// Builds a CSS sourcemap
const autoprefixer = require('gulp-autoprefixer');	// Magic task that add all the CSS browser prefixes automatically
const processHTML = require('gulp-processhtml');	// Handles build time conditions in index.html.
const watch = require('gulp-watch');                // Better alternative to gulp.watch
const gulpSequence = require('gulp-sequence');      // Ensures task has completed before starting next one.
const mergeStream = require('merge-stream');        // Merge two or more streams together.


// Paths
const BUILD_PATH = path.join(__dirname, 'build/');
const SOURCE_PATH = path.join(__dirname, 'src/');
const ASSET_PATH = path.join(__dirname, 'src/assets/');

// Files
const ENTRY_JS_FILE = path.join(SOURCE_PATH, 'js/app.js');
const OUTPUT_JS_FILE = path.join(BUILD_PATH, 'js/');
const ENTRY_SCSS_FILE = path.join(SOURCE_PATH, 'scss/main.scss');
const OUTPUT_CSS_PATH = path.join(BUILD_PATH, 'css/');



/*************************************************************
**
**	Deletes the entire contents of the build directory
**
**************************************************************/

function cleanBuild () {
    return del([BUILD_PATH + '**/*.*']);
}


/*************************************************************
**
**	Copies 'src/media' folder into the '/build' folder.
**
**************************************************************/

function copyAssets () {

    return gulp.src(ASSET_PATH + '**/*')
        .pipe(gulp.dest(BUILD_PATH + 'assets/'));
}



/*************************************************************
**
**	Javascript is originally written in ES2015 script because
**	of how clean and easy to structure it is. Since there are
**	plenty of browsers that can't read it properly it's just
**	easier to translate it back to browser friendly 
**	javascript.
**
**************************************************************/

function processJavascript () {


    var sourcemapPath = OUTPUT_JS_FILE + '.map';

    // handles js files so that they work on the web
    var browserified = browserify({
		paths: [ SOURCE_PATH + 'js/' ],
        entries: [ENTRY_JS_FILE],
        debug: true
    });
	  
	// converts ES6 to vanilla javascript. Note that preset is an NPM dependency
	browserified.transform(babelify, {
     	"presets": ["es2015"]
    });

	// bundles all the "require" dependencies together into one container
	var bundle = browserified.bundle().on('error', function(error){
		console.log('[Build Error]', error.message);
		this.emit('end');
    });

    var bundleStream = bundle
        .pipe( exorcist(sourcemapPath) )
        .pipe( source(OUTPUT_JS_FILE) )
        .pipe( buffer() )
        //.pipe( uglify() )
        .pipe( gulp.dest(BUILD_PATH + 'js/'))

    // copy vendor folder to js/
    var vendorStream = gulp.src( SOURCE_PATH + 'js/vendor/**/**' )
        .pipe(gulp.dest(BUILD_PATH + 'js/vendor/'));

	// now that stream is machine readable javascript, finish the rest of the gulp build tasks
	return mergeStream(bundleStream, vendorStream);
}


/*************************************************************
**
**	Converts SASS to CSS
**
**************************************************************/

function processSASS () {

	var autoprefixerOptions = {
	 	browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
	};

	return gulp.src(ENTRY_SCSS_FILE)
		.pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write())
    	.pipe(autoprefixer(autoprefixerOptions))
        .pipe(gulp.dest(OUTPUT_CSS_PATH))
}


/*************************************************************
**
**	Handles conditional comments in index.html
**
**************************************************************/

function processIndexHTML () {


    return gulp.src(SOURCE_PATH + 'index.html')
        .pipe( processHTML({}) )
        .pipe( gulp.dest(BUILD_PATH) );
}


/*************************************************************
**
**	Starts the Browsersync server and watches for file 
**	updates, which will prompt specific build tasks to the 
**	type of file updated.
**
**************************************************************/

function serve () {
    
    var options = {
        server: {
            baseDir: BUILD_PATH
        },
        open: false // Change it to true if you wish to allow Browsersync to open a browser window.
    };
    
    browserSync(options);
    
    // Watches for changes in files inside the './src' folder.
    watch(SOURCE_PATH + 'js/**/*.js', function () {
        gulp.start('watch-js');
    });

    // Watches for updates to sass css preprocessor files.
    watch(SOURCE_PATH + 'scss/**/*.scss', function () {
        gulp.start('watch-sass');
    });

    // Watches for updates in index.html
    watch(SOURCE_PATH + 'index.html', function () {
        gulp.start('watch-html');
    });
    
    // Watches for changes in files inside the './static' folder. Also sets 'keepFiles' to true (see cleanBuild()).
    gulp.watch(ASSET_PATH + '**/*', function () {
        gulp.start('watch-assets');
    });
}

// TODO: minify CSS
// TODO: compress images in copy-assets, or maybe just add it to a final-build task.


gulp.task('clean-build', cleanBuild);
gulp.task('process-sass', processSASS);
gulp.task('process-html', processIndexHTML);
gulp.task('copy-assets', copyAssets);
gulp.task('process-javascript', processJavascript);
gulp.task('watch-js', ['process-javascript'], browserSync.reload);
gulp.task('watch-sass', ['process-sass'], browserSync.reload);
gulp.task('watch-html', ['process-html'], browserSync.reload);
gulp.task('watch-assets', ['copy-assets'], browserSync.reload);
gulp.task('build', function(callback){
    gulpSequence('clean-build', 'process-sass', 'process-javascript', 'process-html', 'copy-assets')(callback);
});
gulp.task('serve', function(callback){
    gulpSequence('build', serve)(callback);
});