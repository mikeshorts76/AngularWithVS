var exec = require('child_process').exec;
var util = require('util');
var env = process.env.NODE_ENV || 'development';

module.exports = function(grunt) {
    var path = require('path');
    require('load-grunt-tasks')(grunt);
    var ec2Config =  util.format('config/ec2.%s.json', env);
    // Project configuration.
    grunt.initConfig({
        pkg:  grunt.file.readJSON('package.json'),

        concat: {
            options: {
                // define a string to put between each file in the concatenated output
                separator: ';'
            },
            dist: {
                // the files to concatenate
                src: ['public/js/!(home).js'],
                // the location of the resulting JS file
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                // the banner is inserted at the top of the output
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'dist/<%= pkg.name %>.min.js': ['dist/<%= pkg.name %>.js']
                }
            }
        },
        sed: {
           build: {
            pattern: '"USE_CLIENT_BUILD": false',
            replacement: '"USE_CLIENT_BUILD": true',
            path: 'dist/config/config.json'
           }
        },
        ec2: ec2Config
    });


    grunt.loadNpmTasks('grunt-sed');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');

    require('pkginfo')(module);

    grunt.registerTask('update-af', 'update appfog', function() {
        var done = this.async();

        exec('cd dist', function (error, stdout, stderr) {
            if (error) {
                return grunt.fatal(error);
            }

            exec('af update consent-test', function (error, stdout, stderr) {
                if (error) {
                    return grunt.fatal(error);
                }

                done();
            });
        });
    });

    grunt.registerTask('make', 'package up consent for dist"', function() {

        var done = this.async();

        // cleanup dist and package
        exec('rm -rf dist', function (error) {
            if (error) return grunt.fatal(error);


            var nodeVersion = module.exports.engines.node;
            var appName = 'consent'
            var appVersion = module.exports.version;
            //grunt.log.writeln("Using nodeDistUrl " + nodeDistUrl);

            grunt.file.mkdir('dist/public/js/'+ appVersion);

            exec('cp -R public/js/* dist/public/js/' + appVersion, function (error, stdout, stderr) {
                if (error) {
                    return grunt.fatal(error);
                }
            });

            exec("rsync -avi --exclude 'js' public/* dist/public", function (error, stdout, stderr) {
                if (error) {
                    return grunt.fatal(error);
                }
            });

            exec('cp -Rp app.js *.json lib views routes data config node_modules package.json dist/', function (error, stdout, stderr) {
                if (error) {
                    return grunt.fatal(error);
                }

                done();
            });

        });
    });

    grunt.registerTask('package', ['make', 'sed']);
};
