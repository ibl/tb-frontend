module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        connect: {
            server: {
                options: {
                    livereload: true
                }
            }
        },
        watch: {
            options: {
                livereload: true
            },
            files: ["index.html", "scripts/**/*", "styles/**/*", "templates/**/*"]
        }
    });

    grunt.loadNpmTasks("grunt-contrib-connect");
    grunt.loadNpmTasks("grunt-contrib-watch");

    grunt.registerTask("default", ["connect", "watch"]);

};
