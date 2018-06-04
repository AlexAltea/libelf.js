'use strict';

module.exports = function (grunt) {
    // Load tasks from grunt-* dependencies in package.json
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take
    require('time-grunt')(grunt);

    // Project configuration
    grunt.initConfig({
        exec: {
            emscripten: {
                cmd: 'python build.py'
            }
        },
        concat: {
            dist: {
                src: [
                    'src/libelf.out.js',
                    'src/libelf-wrapper.js',
                    'src/libelf-constants.js'
                ],
                dest: 'dist/libelf.min.js'
            }
        },
        connect: {
            options: {
                port: 9001,
                livereload: 35729,
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    open: true
                }
            }
        },
        watch: {
            livereload: {
                files: [
                    'index.html',
                    'dist/*.js'
                ],
                options: {
                    livereload: '<%= connect.options.livereload %>'
                }
            },
        }
    });

    // Project tasks
    grunt.registerTask('build', [
        'exec:emscripten',
        'concat',
    ]);
    grunt.registerTask('serve', [
        'connect',
        'watch'
    ]);
};