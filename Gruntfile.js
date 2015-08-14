module.exports = function (grunt) {

    "use strict";

    var devScripts = grunt.file.readJSON("dev-scripts.json");

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),
        version: "<%= pkg.version %>",
        build_dir: "build/<%= version %>",
        license: grunt.file.read("LICENSE.txt"),

        concat: {
            options: {
                banner: grunt.file.read('BANNER'),
                separator: ';',
                process: true
            },
            core: {
                src: devScripts.core,
                dest: "<%= build_dir %>/<%= pkg.name %>-<%= version %>.js"
            }
        },

        uglify: {
            options: {
                report: "min",
                banner: grunt.file.read('BANNER')
            },
            core: {
                files: {
                    "<%= build_dir %>/<%= pkg.name %>-<%= version %>.min.js": "<%= concat.core.dest %>"
                }
            }
        },

        jshint: {
            options: {
                eqeqeq: true,
                undef: true,
                unused: true,
                strict: true,
                indent: 2,
                immed: true,
                newcap: true,
                nonew: true,
                trailing: true
            },
            grunt: {
                src: "Gruntfile.js",
                options: {
                    node: true
                }
            },
            engine: {
                options: {
                    browser: true,
                    globals: {
                        BIMSURFER: true
                    }
                },
                src: [
                    "<%= concat.engine.src %>"
                ]
            }
        },

        clean: {
            tmp: "tmp/*.js",
            docs: ["docs/*"]
        },

        jasmine: {
            pivotal: {
                src: 'src/**/*.js',
                options: {
                    specs: 'tests/*Spec.js',
                    helpers: 'tests/*Helper.js'
                }
            }
        },

        yuidoc: {
            all: {
                name: '<%= pkg.name %>',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                url: '<%= pkg.homepage %>',
                options: {
                    paths: ['src/viewer'],
                    outdir: './docs/',
                    exclude : "renderer, utils, webgl"
                },
                logo: '../assets/images/logo.png'
            }
        },

        copy: {
            minified: {
                src: '<%= build_dir %>/<%= pkg.name %>-<%= version %>.min.js',
                dest: 'build/<%= pkg.name %>.min.js'
            },
            unminified: {
                src: '<%= build_dir %>/<%= pkg.name %>-<%= version %>.js',
                dest: 'build/<%= pkg.name %>.js'
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-yuidoc");
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jasmine');


    grunt.registerTask("compile", ["clean", "concat", "uglify", "copy"]);
    grunt.registerTask("build", ["test", "compile"]);
    grunt.registerTask("docs", ["clean", "yuidoc"]);
    grunt.registerTask("default", "test");
    grunt.registerTask("all", ["build", "docs"]);

    grunt.registerTask("snapshot", ["concat", "uglify", "copy"]);
};
