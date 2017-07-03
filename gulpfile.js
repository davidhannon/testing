const gulp = require('gulp');
const mergeStream = require('merge-stream');
const PolymerProject = require('polymer-build').PolymerProject;
const project = new PolymerProject(require('./polymer.json'));
const {generateCountingSharedBundleUrlMapper,
       generateSharedDepsMergeStrategy} = require('polymer-bundler');

gulp.task('default', function() {
  // place code for your default task here
  mergeStream(project.sources(), project.dependencies())
    .pipe(project.bundler({
      excludes: ['bower_components/polymer-code-mirror'],
      sourcemaps: true,
      stripComments: true,
      strategy: generateSharedDepsMergeStrategy(3),
      urlMapper: generateCountingSharedBundleUrlMapper('shared/bundle_')
    }))
    .pipe(project.addCustomElementsEs5Adapter())
    .pipe(gulp.dest('build/'));
});