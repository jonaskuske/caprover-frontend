const gulp = require('gulp')
const gulpless = require('gulp-less')
const debug = require('gulp-debug')
var csso = require('gulp-csso')
const autoprefixer = require('gulp-autoprefixer')
const NpmImportPlugin = require('less-plugin-npm-import')

gulp.task('watch', function () {
    gulp.watch(['src/styles/*'], function (obj) {
        gulp.start('less')
    })
})

gulp.task('less', function () {
    return gulp
        .src('src/styles/*-theme.less')
        .pipe(debug({ title: 'Less files:' }))
        .pipe(
            gulpless({
                javascriptEnabled: true,
                plugins: [new NpmImportPlugin({ prefix: '~' })],
            })
        )
        .pipe(autoprefixer())
        .pipe(
            csso({
                debug: true,
            })
        )
        .pipe(gulp.dest('./public'))
})
