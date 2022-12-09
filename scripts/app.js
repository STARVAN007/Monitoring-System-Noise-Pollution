(function () {
	'use-strict';

	angular
		.module('sonometerApp', ['angular-confirm' ,'ngSails', 'geolocation', 'ui.router', 'ngAria', 'ui.bootstrap', 'ngAnimate', 'ngSanitize', 'oc.lazyLoad', 'ngMap', 'colorpicker.module', 'highcharts-ng'])
		.run(mainRun)
		.config(mainConfig)
		.controller('mainController', mainController);

	function mainRun ($rootScope, $state, $stateParams, $window, userService) {
		$rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
      
        $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
          if (toState.authenticate && !userService.isAuthenticated && !$window.sessionStorage.user){
            $state.transitionTo("access.signin");
            event.preventDefault(); 
          } else if (toState.name == "access.signin" && $window.sessionStorage.user) {
            $state.transitionTo("app.dashboard");
            event.preventDefault();
          }
        });
	}

	function mainConfig ($sailsProvider, $stateProvider, $urlRouterProvider ,$ocLazyLoadProvider) {
		$sailsProvider.url = 'http://localhost:1337';

		$ocLazyLoadProvider.config({
			debug:false,
			events:true,
		});

		$urlRouterProvider
			.otherwise('/gettin/data');

		$stateProvider
			.state('app', {
				abstract: true,
				url: '/app',
				views: {
					'': {
						templateUrl: 'views/layout.html'
					},
					'aside': {
						templateUrl: 'views/aside.html'
					},
					'content': {
						templateUrl: 'views/content.html'
					}
				},
				resolve: {
					loadMyFiles: function ($ocLazyLoad) {
						return $ocLazyLoad.load({
							files: [
								'scripts/directives/sidebar.js',
								'scripts/dashboard.js',
								'scripts/controllers/modals/messageController.js',
								'scripts/directives/spinner.js'
							]
						});
					}
				}
			})
				.state('app.dashboard', {
					url: '/dashboard',
					templateUrl: 'views/pages/dashboard.html',
					data : { title: 'Tablero Principal' },
					authenticate: true,
					controller: 'dashboardController as dashboard',
					resolve: {
						loadMyFiles: function ($ocLazyLoad) {
							return $ocLazyLoad.load({
								files: [
									'scripts/controllers/dashboardController.js'
								]
							});
						}
					}
				})
				.state('app.zona', {
					url: '/zona',
					templateUrl: 'views/pages/zona.html',
					data : { title: 'Mantenedor de zonas' },
					authenticate: true,
					controller: 'zonaController as zona',
					resolve: {
						loadMyFiles: function ($ocLazyLoad) {
							return $ocLazyLoad.load({
								files: [
									'scripts/controllers/zonaController.js'
								]
							});
						}
					}
				})
				.state('app.incidencias', {
					url: '/incidencias',
					templateUrl: 'views/pages/incidencias.html',
					data : { title: 'Listado de incidencias' },
					authenticate: true,
					controller: 'incidenciasController as incidencias',
					resolve: {
						loadMyFiles: function ($ocLazyLoad) {
							return $ocLazyLoad.load({
								files: [
									'scripts/controllers/incidenciasController.js'
								]
							});
						}
					}
				})
			.state('access', {
				url: '/access',
				template: '<div class="container"><div class="row"><div class="col-sm-6 col-md-4 col-md-offset-4" ui-view></div></div></div>'
			})
				.state('access.signin', {
					url: '/signin',
					templateUrl: 'views/pages/signin.html',
					data : { title: 'Iniciar Sesión' },
					authenticate: false,
					controller: 'loginController as login',
					resolve: {
						loadMyFiles:function($ocLazyLoad) {
							return $ocLazyLoad.load({
								files:[
									'scripts/controllers/loginController.js'
									
								]
							})
						}
					}
				})
			.state('gettin', {
				url: '/gettin',
				template: '<div class="container"><div class="row" ui-view></div></div>',
				resolve: {
					loadMyFiles:function($ocLazyLoad) {
						return $ocLazyLoad.load({
							files:[
								'scripts/controllers/modals/messageController.js'
							]
						})
					}
				}
			})
				.state('gettin.data', {
					url: '/data',
					templateUrl: 'views/pages/process.html',
					data : { title: 'Obtención de datos' },
					authenticate: false,
					controller: 'processController as process',
					resolve: {
						loadMyFiles:function($ocLazyLoad) {
							return $ocLazyLoad.load({
								files:[
									'scripts/controllers/processController.js',
									'scripts/directives/spinner.js'
								]
							})
						}
					}
				});
	}

	function mainController (userService, $state, $window) {
		var main = this;

		main.logout = function () {
			userService.isAuthenticated = false;
			userService.dataUser = {};

			delete $window.sessionStorage.user;

			$state.transitionTo("access.signin");
		}
	}
})();