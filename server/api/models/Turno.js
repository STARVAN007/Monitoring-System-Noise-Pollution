/**
* Turno.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	connection: 'mysql',
	autoCreatedAt : false,
  	autoUpdatedAt : false,
	attributes: {
		turno_id: {
			type: 'integer',
            autoIncrement: true,
            primaryKey: true
		},
		turno: {
			type: 'string',
			required: true
		},
		hora_inicio: {
			type: 'time',
			required: true
		},
		hora_fin: {
			type: 'time',
			required: true
		},
		niveles: {
			collection: 'nivel',
			via: 'turno_id'
		},
		incidencias: {
			collection: 'incidencia',
			via: 'turno_id'
		}
	}
};

