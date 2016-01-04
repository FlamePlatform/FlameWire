'use strict';
var gulp = require("gulp")
var babel = require("gulp-babel")
var print = require("gulp-print");
var newer = require("gulp-newer")
var shell = require("shelljs")


gulp.task("documentation", function() {
  shell.exec("npm run documentation");
})

gulp.task("build", ["documentation"], function() {
  let dest = "dist";
  return gulp.src("src/**/*.js").
  pipe(newer(dest)).
  pipe(babel({
    presets: ["es2015", "stage-0"],
    plugins: ["transform-runtime"]
  })).
  pipe(print(function(file) {
    return "built " + file
  })).
  pipe(gulp.dest(dest))
})

gulp.task("build-all", ["build"])


gulp.task("watch", ["build"], function() {
  gulp.watch("src/**/*.js", ["build"])
})
