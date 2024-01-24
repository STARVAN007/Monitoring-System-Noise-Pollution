(function () {
	'use-strict';

	angular
		.module('sonometerApp')
		.controller('loginController', loginController);

	function loginController (userService, $timeout, $state, $window) {
		var login = this;

		login.logIn = function (username, password) {
			login.message = null;
			if (username !== undefined && password !== undefined) {
                login.tipo_mensaje = 'primary';
                login.mensaje = 'Validando datos.';
                $timeout(function(){
                    var band = userService.logIn(username, password);

                    if (band == 1) {
                    	login.tipo_mensaje = 'success';
                		login.mensaje = 'Datos correctos redireccionando.';
                		
                		$timeout(function(){
                            userService.isAuthenticated = true;
                            //$window.sessionStorage.user = CryptoJS.SHA256(username).toString(CryptoJS.enc.Base64);

							$window.sessionStorage.user =username;

                            userService.dataUser = {name: username};

                            $state.transitionTo("app.dashboard");
                        }, 1000);
                    } else if (band == 2) {
                    	login.tipo_mensaje = 'warning';
                		login.mensaje = 'Datos incorrectos.';
                    } else {
                    	login.tipo_mensaje = 'danger';
                		login.mensaje = 'No existe usuario.';
                    }
                }, 1000);
            }
		};
	}
})();