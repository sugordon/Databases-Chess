'use strict';

var paths = {
    src: {
        js: 'client/js',
        less: 'client/css'
    },
    clean: [],
    output: {
        less: 'app/public/css',
        js:'app/public/js'
    }
};

var gulp = require('gulp');
var del = require('del');
var path = require('path');
var uglify = require('gulp-uglify');
var pkg = require('./package.json');
var less = require('gulp-less');
var cleanCSS = require('gulp-clean-css');
var nodemon = require('gulp-nodemon');

function swallowError (error) {
    console.log(error.toString())
    this.emit('end')
}

function buildJS(minify) {
    var stream = gulp.src(path.join(paths.src.js, '/*.js'));

    if (minify) {
        var uglifyOptions = {
            mangle: true,
            compress: {}
        };
        stream = stream.pipe(uglify(uglifyOptions))
            .on('error', swallowError);
    }
    return stream.pipe(gulp.dest(paths.output.js));
}

gulp.task('build:js', function() {
    return buildJS(true);
});

gulp.task('build:js_pretty', function() {
    return buildJS(false);
});

gulp.task('build:less', function() {
    return buildLess(paths.src.less);
});

function buildLess(path) {
    return gulp.src(path)
        .pipe(less())
        .pipe(cleanCSS())
        .pipe(gulp.dest(paths.output.less));
}

gulp.task('build', ['build:less', 'build:js']);
gulp.task('build_dev', ['build:less', 'build:js_pretty']);

gulp.task('clean', function() {
    return del(paths.clean);
});

gulp.task('default', ['build_dev'], function() {
    nodemon({
        script: 'app.js',
        ignore: ['gulpfile.js', 'node_modules/**', 'public/**', '*.log*'],
        watch: ['server.js', 'app/*.js', 'app/server/**/*.js'],
        ext: 'js',
        nodeArgs: ['--debug']
    });
    gulp.watch('app/client/js/**/*.js', function(event) {
        buildJS(false);
    });
    gulp.watch('app/client/css/**/*.less', function(event) {
        return buildLess(paths.src.less);
    });
});

