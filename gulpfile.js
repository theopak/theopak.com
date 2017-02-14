var gulp = require('gulp')
var htmlmin = require('gulp-htmlmin')

gulp.task('minify', function() {
 return gulp.src('src/*.html')
   .pipe(htmlmin({
     collapseWhitespace: true,
     minifyCSS: true
   }))
   .pipe(gulp.dest('docs'))
})
