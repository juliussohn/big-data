module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sass: {
            options: {
                includePaths: ['bower_components/foundation/scss']
            },
            dist: {
                options: {
                    outputStyle: 'uncompressed'
                },
                files: {
                    'css/app.css': 'scss/app.scss'
                }
            }
        },
        watch: {
            grunt: {
                files: ['Gruntfile.js']
            },
            sass: {
                files: 'scss/**/*.scss',
                tasks: ['sass'/*,'autoprefixer'*/],
                
            },
            options: {
      livereload: true,
    },
       
        },
        bower_concat: {
            all: {
                dest: 'js/libs.js',
                cssDest: 'css/libs.css',
                dependencies: {
                    'foundation': 'jquery',
                },
                mainFiles: {
                    'foundation': 'js/foundation.js',
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-bower-concat');
    grunt.registerTask('build', ['sass']);
    grunt.registerTask('default', ['build', 'watch']);
}