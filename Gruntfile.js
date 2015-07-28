module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sass: {
            options: {
                includePaths: ['bower_components/foundation/scss']
            },
            dist: {
                options: {
                    outputStyle: 'compressed'
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
                tasks: ['sass' ,'autoprefixer' ],
            },
            options: {
                livereload: true,
            },
        },
        uglify: {
            my_target: {
                files: {
                    'js/libs.min.js': ['js/libs.js'],
                    'js/app.min.js': ['js/app.js'],
                }
            }
        },
        bower_concat: {
            all: {
                dest: 'js/libs.js',
                cssDest: 'css/libs.css',
                dependencies: {
                    'foundation': 'jquery',
                },
                mainFiles: {
                    'foundation': ['js/foundation/foundation.js', 'js/foundation/foundation.magellan.js', 'js/foundation/foundation.reveal.js', 'js/foundation/foundation.topbar.js'],
                    'navicon-transformicons': 'css/style.css',
                    'radios-to-slider': ['css/radios-to-slider.css', 'js/jquery.radios-to-slider.min.js'],
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-bower-concat');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.registerTask('build', ['bower_concat', 'uglify', 'sass']);
    grunt.registerTask('default', ['build', 'watch']);
}