module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        connect: {
            dev: {
                options: {
                    livereload: 8081,
                    port: 8080,
                    hostname: "*"
                }
            },
            dist: {
                options: {
                    livereload: 8081,
                    open: true,
                    base: "dist",
                    port: 8080,
                    hostname: "*"
                }
            }
        },
        watch: {
            dev: {
                options: {
                    livereload: 8081
                },
                files: ["index.html", "scripts/**/*", "styles/**/*", "templates/**/*"]
            },
            dist: {
                options: {
                    livereload: 8081
                },
                files: ["index.html", "scripts/**/*", "styles/**/*", "templates/**/*"],
                tasks: ['build']
            }
        },
        html2js: {
            options: {
                base: "",
                fileHeaderString: "(function () {",
                fileFooterString: "})();"
            },
            app: {
                src: ["templates/**/*.html"],
                dest: ".tmp/templates.js"
            }
        },
        concat: {
            scripts: {
                src: [".tmp/templates.js", "scripts/app.js"],
                dest: "dist/scripts/app.js"
            }
        },
        copy: {
            index: {
                src: "index.html",
                dest: "dist/index.html"
            },
            glyphicons: {
                cwd: "bower_components/bootstrap/dist/fonts/",
                src: "**",
                dest: "dist/fonts/",
                filter: "isFile",
                expand: true
            },
            module: {
                src: "scripts/module.js",
                dest: "dist/module.js"
            }
        },
        useminPrepare: {
            html: "dist/index.html",
            options: {
                dist: "dist",
                root: ".",
                flow: {
                    steps: { "js": ["concat"], "css": ["concat"]},
                    post: {}
                }
            }
        },
        usemin: {
            html: "dist/index.html"
        }
    });

    grunt.loadNpmTasks("grunt-contrib-connect");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-html2js");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-usemin");
    grunt.loadNpmTasks("grunt-contrib-copy");

    grunt.registerTask("default", ["connect:dev", "watch:dev"]);
    grunt.registerTask("build", ["html2js", "copy", "useminPrepare", "concat", "usemin"]);
    grunt.registerTask("serve", ["build", "connect:dist", "watch:dist"]);

};
