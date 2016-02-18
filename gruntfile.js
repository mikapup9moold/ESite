module.exports = function(grunt) {
	//var critical = require('critical');
	var Imagemin = require('imagemin');
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		postcss : {
			options: {
				map: true,
				processors: [
					//require('autoprefixer-core')({browsers: ['last 2 versions']})
				]
			},
			dist: {
				src: 'css/main.css',
				dest: 'dist/css/main.css'
			}
		},

		critical: {
		    test: {
		        options: {
		            base: './',
		            css: [
		                'dist/css/main.css'
		            ],
		            dimensions: [{
		            	width:320,
		            	height: 600
		            },{
		            	width: 1200,
		            	height: 900
		            }]
		        },
		        src: 'index.html',
		        dest: 'dist/index.html'
		    }
		},

		cssmin: {
			main: {
				files: [{
					expand: true,
					cwd: 'dist/css/',
					src: ['*.css', '!*.min.css'],
					dest: 'dist/css/',
					ext: '.css'
				}]
			}
		},

		uglify: {
			targets: {
				files: {
					'dist/app.js': ['js/app.js']
				}
			}
		},

		htmlmin: {
			main: {
				options: {
					removeComments: true,
					collapseWhitespace: true
				},
				files: {
					'dist/index.html' : 'dist/index.html',
				}
			}
		},

		responsive_images: {
			myTask: {
				options: {
					engine: 'im',
				sizes: [{
						width: 200
					},{
					  width: 400
					},{
					  width: 600
					},{
					  width: 800
					},{
					  width: 1000
					}]
				},
				files: [{
					expand: true,
					src: ['img/**.{jpg,JPG,png,PNG}'],
					dest: 'dist/'
				}]
			}
		},

		imagemin: {
			/*static: {
				options: {
					optimizationLevel: 3,
					svgoPlugins: [{removeViewBox: false}],
					use: [Imagemin.jpegtran({progressive: true})]
				},
				files: {
					'dist/img/' : 'img/'
				} 
			},*/
			dynamic: {
				options: {
					optimizationLevel: 3,
					svgoPlugins: [{removeViewBox: false}],
					use: [Imagemin.jpegtran({progressive: true})]
				},
				files: [{
					expand: true,
					cwd: 'img/',
					src: ['**/*.{png,jpg,gif}'],
					dest: 'dist/img/'
				}]
			}
		},

	});

	grunt.loadNpmTasks('grunt-postcss');
	grunt.loadNpmTasks('grunt-critical');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-responsive-images');
	grunt.loadNpmTasks('grunt-contrib-imagemin');


	grunt.registerTask('default', ['postcss', 'critical', 'cssmin', 'uglify', 'htmlmin', 'responsive_images', 'imagemin']);
};