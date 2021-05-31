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
                cmd: 'python3 build.py'
            }
        },
        concat: {
            dist: {
                src: [
                    'src/libelf.out.js',
                    'src/libelf-constants.js',
                    'src/libelf-strings.js',
                    'src/libelf-integers.js',
                    'src/libelf-wrapper.js',
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
