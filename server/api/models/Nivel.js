/**
* Nivel.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	connection: 'mysql',
	autoCreatedAt : false,
  	autoUpdatedAt : false,
	attributes: {
		nivel_id: {
			type: 'integer',
            autoIncrement: true,
            primaryKey: true
		},
		nivel: {
			type: 'string',
			required: true
		},
		desde: {
			type: 'integer',
			required: true
		},
		hasta: {
			type: 'integer',
			required: true
		},
		turno_id: {
			model: 'turno'
		},
		incidencias: {
			collection: 'incidencia',
			via: 'nivel_id'
		}
	}
};

