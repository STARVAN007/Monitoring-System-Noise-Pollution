/**
* Incidencia.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	connection: 'mysql',
	autoCreatedAt : false,
  	autoUpdatedAt : false,
	attributes: {
		incidencia_id: {
			type: 'integer',
            autoIncrement: true,
            primaryKey: true
		},
		latitud: {
			type: 'float',
			required: true
		},
		longitud: {
			type: 'float',
			required: true
		},
		temperatura: {
			type: 'float',
			required: true
		},
		humedad: {
			type: 'float',
			required: true
		},
		suelo_nivel: {
			type: 'float'
		},
		mar_nivel: {
			type: 'float'
		},
		velocidad_viento: {
			type: 'float',
			required: true
		},
		hora_incidencia: {
			type: 'datetime',
			defaultsTo: function (){ return new Date(); }
		},
		sonometro: {
			type: 'float',
			required: true
		},
		zona_id: {
			model: 'zona'
		},
		turno_id: {
			model: 'turno'
		},
		factor_id: {
			model: 'factor'
		},
		nivel_id: {
			model: 'nivel'
		}
	}
};

