/**
* Zona.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	connection: 'mysql',
	autoCreatedAt : false,
  	autoUpdatedAt : false,
	attributes: {
		zona_id: {
			type: 'integer',
            autoIncrement: true,
            primaryKey: true
		},
		zona: {
			type: 'string',
			required: true
		},
		path: {
			type: 'string',
			required: true
		},
		stroke_color: {
			type: 'string',
			required: true
		},
		fill_color: {
			type: 'string',
			required: true
		},
		referencia_inicial: {
			type: 'string',
			required: true
		},
		referencia_final: {
			type: 'string',
			required: true
		},
		limite_maximo: {
			type: 'float',
			required: true
		},
		distrito_id: {
			model: 'distrito'
		},
		incidencias: {
			collection: 'incidencia',
			via: 'zona_id'
		},
		tipo_zona_id: {
			model: 'tipo_zona'
		}
	}
};

