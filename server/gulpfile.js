var gulp = require("gulp"),
    csslint = require("gulp-csslint"),
    cssminifier = require("gulp-minify-css"),
    sourcemaps = require("gulp-sourcemaps"),
    jshint = require("gulp-jshint"),
    hintstylish = require("jshint-stylish"),
    uglify = require("gulp-uglify"),
    concat = require("gulp-concat"),
    notify = require("gulp-notify"),
    sass = require('gulp-sass'),
    imagemin= require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    apidoc = require('gulp-apidoc'),
    gulpFilter = require('gulp-filter'),
    webpack = require("gulp-webpack"),
    webpackConfig = require("./webpack.config.js"),
    testsConfig = require("./source/js/tests/webpack.config.js"),
    stream = require('webpack-stream');

var path={
    source:{
        js: ["./source/js/**/**/*.js"],
        js_tests: "./source/js/tests/**/*.js",
        js_modules: "./source/js/modules/**/*.js",
        js_models: "./source/js/models/**/*.js",
        js_app:'./source/js/modules.bundle.js',
        tests:'./tests',
        css: "./source/css/**/*.css",
        sass: './source/sass/**/*.scss',
        images:"./source/images/**/*",
        api: "./routes/api/*"
    },
    build:{
        js:'./source/build/js',
        css:"./source/build/css",
        images:'./source/build/images'
    },
    destination:{
        js:'./public/js',
        css:"./public/css",
        images:'./public/images'
    }

};

gulp.task("run", function() {
    //start all
    gulp.start('js-build','sass-build','images-build','apidoc','webpack-build','default');
});

gulp.task("default", function() {
    var sassWatcher = gulp.watch(path.source.sass, ['sass-build','copy:css','publish']);
    sassWatcher.on("change", function(event) {
        console.log("File: " + event.path + " was " + event.type);

    });


    var imageWatcher = gulp.watch(path.source.images, ["images-build"]);
    imageWatcher.on("change", function(event) {
        console.log("File: " + event.path + " was " + event.type);
    });


    var apiDocWatcher = gulp.watch(path.source.api, ["apidoc"]);
    apiDocWatcher.on("change", function(event) {
        console.log("File: " + event.path + " was " + event.type);
    });

    var webpackWatcher = gulp.watch('./webpack.config.js', ['webpack-build']);
    webpackWatcher.on("change", function(event) {
        console.log("File: " + event.path + " was " + event.type);
    });

    var testsWatcher = gulp.watch(path.source.js_tests, ['webpack-build:tests','copy:tests']);
    testsWatcher.on("change", function(event) {
        console.log("File: " + event.path + " was " + event.type);
    });


    var jsWatcher = gulp.watch(path.source.js, ["js-build",'webpack-build',"publish"]);
    jsWatcher.on("change", function(event) {
        console.log("File: " + event.path + " was " + event.type);
    });
});



//tasks
//build
gulp.task('sass-build', function () {
    gulp.src(['./source/sass/style.scss'])
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(path.build.css))
        .pipe(cssminifier())
        .pipe(concat("style.min.css"))
        .pipe(gulp.dest(path.build.css))
});

gulp.task('copy:css', function(){
    gulp.src('./source/css/**')
        .pipe(gulp.dest('./source/build/css/'));
});
gulp.task('copy:tests', function(){
    gulp.src('./source/js/tests/**')
        .pipe(gulp.dest('./public/tests/'));
});

gulp.task("webpack-build", function() {
    gulp.src(path.source.js)
        .pipe(jshint())
        //.pipe(jshint.reporter(hintstylish))
        .pipe(sourcemaps.init())
        .pipe(stream(webpackConfig))
        .pipe(sourcemaps.write())
        //.pipe(uglify())
        .pipe(gulp.dest(path.build.js));
        //.pipe(notify({ message: 'js webpack built'}));
});
gulp.task("webpack-build:tests", function() {
    gulp.src(path.source.js)
        .pipe(jshint())
        //.pipe(jshint.reporter(hintstylish))
        .pipe(sourcemaps.init())
        .pipe(stream(testsConfig))
        .pipe(sourcemaps.write())
        //.pipe(uglify())
        .pipe(gulp.dest('./source/js/tests'));
        //.pipe(notify({ message: 'js webpack built'}));
});

gulp.task('images', function () {
    gulp.src(path.source.images)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(path.build.images));
});

gulp.task("js-build", function() {
    gulp.src([path.source.js_modules])
        .pipe(jshint())
        .pipe(jshint.reporter(hintstylish))
        .pipe(sourcemaps.init())
        .pipe(concat("modules.min.js"))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js));
    //.pipe(notify({ message: 'js built'}));
});


//build to public
gulp.task('apidoc', function(done){
    apidoc({
        src: "routes/api/",
        dest: "public/api/"
    },done);
});



gulp.task('publish', function(){
    //gulp.start('js-build','sass-build','images-build','apidoc','webpack-build','copy:publish');
    gulp.src('./source/build/**')
        .pipe(gulp.dest('./public/'))
});



