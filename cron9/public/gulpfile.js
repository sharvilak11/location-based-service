var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var htmlreplace = require('gulp-html-replace');
var insert = require('gulp-insert');

var bower_files = [
    "bower_components/jquery/dist/jquery.min.js",
    "bower_components/jquery.easing/js/jquery.easing.js",
    "bower_components/moment/moment.js",
    "bower_components/angular/angular.min.js",
    "bower_components/masonry/dist/masonry.pkgd.min.js",
    "bower_components/pace/pace.min.js",
    "bower_components/angular-animate/angular-animate.min.js",
    "bower_components/angular-sanitize/angular-sanitize.js",
    "bower_components/angular-ui-router/release/angular-ui-router.js",
    "bower_components/angular-ui-router-tabs/src/ui-router-tabs.js",
    "bower_components/angular-ui-bootstrap-bower/ui-bootstrap-tpls.js",
    "bower_components/angular-ui-select/dist/select.min.js",
    "bower_components/angular-filter/dist/angular-filter.js",
    "bower_components/angular-messages/angular-messages.js",
    "bower_components/sweetalert/lib/sweet-alert.min.js",
    "bower_components/lodash/lodash.js",
    "bower_components/fastclick/lib/fastclick.js",
    "bower_components/angular-cron-jobs/dist/angular-cron-jobs.js"
];

var e9_files = [
];

var app_files = [
    "webapp/app.js",
    "webapp/login.js",
    "webapp/home/home.controller.js",
    "webapp/layout/header.controller.js",
    "webapp/jobs/jobs.module.js",
    "webapp/jobs/all/table.controller.js",
    "webapp/jobs/item/details.controller.js",
    "webapp/logs/logs.module.js",
    "webapp/settings/settings.module.js",
    "webapp/common/directives/logs.directive.js"
];

var htmlReplaceOptions = {
    keepUnassigned: true,
    keepBlockTags: true
}

gulp.task('compile-all', ['compile-bower', 'compile-common', 'compile-app']);


gulp.task('compile-bower', function () {
    gulp.src(bower_files)
        .pipe(uglify())
        .pipe(insert.append(';;;'))
        .pipe(concat('dependencies.min.js'))
        .pipe(gulp.dest('includes/js'));
});

gulp.task('compile-common', function () {
    gulp.src(e9_files)
        .pipe(uglify())
        .pipe(insert.append(';;;'))
        .pipe(concat('components.min.js'))
        .pipe(gulp.dest('includes/js'));
});

gulp.task('compile-app', function () {
    gulp.src(app_files)
        .pipe(uglify())
        .pipe(insert.append(';;;'))
        .pipe(concat('app.min.js'))
        .pipe(gulp.dest('includes/js'));
});


gulp.task('build-debug', function () {
    gulp.src('index.html')
        .pipe(htmlreplace({
            'bower': bower_files,
            'components': e9_files,
            'app': app_files
        }, htmlReplaceOptions))
        .pipe(gulp.dest(''));
});


gulp.task('build-prod', ['compile-app', 'compile-common', 'compile-bower'], function () {
    gulp.src('index.html')
        .pipe(htmlreplace({
            'bower': 'includes/js/dependencies.min.js',
            'components': 'includes/js/components.min.js',
            'app': 'includes/js/app.min.js'
        }, htmlReplaceOptions))
        .pipe(gulp.dest(''));
});