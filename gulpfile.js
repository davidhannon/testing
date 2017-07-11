const gulp = require('gulp');
var vulcanize = require('gulp-vulcanize');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
const mergeStream = require('merge-stream');
const PolymerProject = require('polymer-build').PolymerProject;
const project = new PolymerProject(require('./polymer.json'));
const {generateCountingSharedBundleUrlMapper,
       generateSharedDepsMergeStrategy} = require('polymer-bundler');

const babel = require('gulp-babel');
const gulpif = require('gulp-if');
const uglify = require('gulp-uglify');
const htmlMinifier = require('gulp-html-minifier');
const HtmlSplitter = require('polymer-build').HtmlSplitter;

gulp.task('vulc', function() {
  gulp.src('index.html')
    .pipe(vulcanize({
      stripComments: true,
      inlineScripts: true,
      inlineCss: true,
      rewriteUrlsInTemplates: true
    }))
    .pipe(gulp.dest('build/'))
});

gulp.task('default', function() {
  var processors = [
    autoprefixer({browsers: ["> 5%", "Firefox < 20", "Safari >= 9"]})
  ];
  const sourcesHtmlSplitter = new HtmlSplitter();
  const sourcesStream = project.sources()
    .pipe(sourcesHtmlSplitter.split()) // split inline JS & CSS out into individual .js & .css files
    .pipe(gulpif(/\.js$/,  babel({ presets: ['es2015'] })))
    .pipe(gulpif(/\.html$/, htmlMinifier()))
    .pipe(sourcesHtmlSplitter.rejoin()); // rejoins those files back into their original location

  return mergeStream(sourcesStream, project.dependencies())
    .pipe(gulpif(/\.css$/, postcss(processors)))
    // .pipe(vulcanize({
    //   dest: '/sudo bower build/'
    //   // stripComments: true
    // }))
    .pipe(project.bundler({
      sourcemaps: false,
      stripComments: true,
      inlineScripts: true,
      inlineCss: true,
      rewriteUrlsInTemplates: true
    }))
    .pipe(gulpif(/\.html$/, htmlMinifier()))
    .pipe(gulp.dest('build/'));
});