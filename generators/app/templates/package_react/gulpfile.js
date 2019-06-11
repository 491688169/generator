const path = require('path');
const fs = require('fs');

const gulp = require('gulp');
const gulpsass = require('gulp-sass');
const postcss = require('gulp-postcss');
const cssModules = require('postcss-modules');

gulp.task('scss', function() {
    return gulp
        .src('./src/**/*.scss')
        .pipe(gulpsass())
        .pipe(postcss([cssModules({ getJSON: getJSONFromCssModules })]));
});

function getJSONFromCssModules(cssFileName, json) {
    const cssName = path.basename(cssFileName, '.css');
    const jsonFileName = path.resolve('./build', cssName + '.json');
    fs.writeFileSync(jsonFileName, JSON.stringify(json));
}
