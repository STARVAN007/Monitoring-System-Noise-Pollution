/**
 * IncidenciaController
 *
 * @description :: Server-side logic for managing incidencias
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	data_last_week : function (req, res) {
		Incidencia.query('select avg(incidencia.sonometro) as promedio, concat(day(incidencia.hora_incidencia), "/", month(incidencia.hora_incidencia), "/", year(incidencia.hora_incidencia)) as dia, turno.turno from incidencia inner join turno on turno.turno_id = incidencia.turno_id where incidencia.zona_id = ' + req.param('zona_id') + ' and incidencia.hora_incidencia between date_sub(now(), interval 100 day) and now() group by incidencia.turno_id, day(incidencia.hora_incidencia) order by incidencia.hora_incidencia asc;', function (err, response) {
			if (err) return res.send(err,500);
  			res.json(response);
		});
	},
	data_range : function (req, res) {
		Incidencia.query('select avg(incidencia.sonometro) as promedio from incidencia where incidencia.zona_id = ' + req.param('zona_id') + ' and incidencia.turno_id = ' + req.param('turno_id') + ' and incidencia.hora_incidencia between "' + req.param('inicio') + ' 00:00:00" and "' + req.param('fin') + ' 23:59:59";', function (err, response) {
			if (err) return res.send(err,500);
  			res.json(response);
		});
	},
	dots_range: function (req, res) {
		Incidencia.find({
			zona_id: req.param('zona_id'),
			turno_id: req.param('turno_id'),
			hora_incidencia: {
				'>=' : req.param('inicio') + ' 00:00:00',
				'<=' : req.param('fin') + ' 23:59:59'
			}
		}).populate('nivel_id').exec(function (err, response) {
			if (err) return res.send(err,500);
  			res.json(response);
		});
	},
	data_range_fechas: function (req, res) {
		Incidencia.query('select concat(day(incidencia.hora_incidencia), "/", month(incidencia.hora_incidencia), "/", year(incidencia.hora_incidencia)) as dia, avg(incidencia.sonometro) as promedio from incidencia where incidencia.zona_id = ' + req.param('zona_id') + ' and incidencia.turno_id = ' + req.param('turno_id') + ' and incidencia.hora_incidencia between "' + req.param('inicio') + ' 00:00:00" and "' + req.param('fin') + ' 23:59:59" group by day(incidencia.hora_incidencia) order by incidencia.hora_incidencia asc;', function (err, response) {
			if (err) return res.send(err,500);
  			res.json(response);
		});
	},
	count_incidencias: function (req, res) {
		Incidencia.count().exec(function (err, found) {
		  res.json(found)
		});
	},
   	count: function (req, res) {
   		var zona_id = req.param("zona_id", null), turno_id = req.param("turno_id", null), inicio = req.param("inicio", null), fin = req.param("fin", null), where = {};

		if (zona_id !== null && turno_id !== null) {
			where = {turno_id: turno_id, zona_id: zona_id, hora_incidencia: {
				'>=' : inicio + ' 00:00:00',
				'<=' : fin + ' 23:59:59'
			}};
		} else if (zona_id !== null && turno_id === null) {
			where = {zona_id: zona_id, hora_incidencia: {
				'>=' : inicio + ' 00:00:00',
				'<=' : fin + ' 23:59:59'
			}};
		} else if (zona_id === null && turno_id !== null){
			where = {turno_id: turno_id, hora_incidencia: {
				'>=' : inicio + ' 00:00:00',
				'<=' : fin + ' 23:59:59'
			}};
		} else {
			where = {hora_incidencia: {
				'>=' : inicio + ' 00:00:00',
				'<=' : fin + ' 23:59:59'
			}};
		}

		Incidencia.count(where).exec(function(error, count){
			return res.json({
			  count: count,
			});
		});
	},
	grid_incidencias: function (req, res) {
		var page = req.param("page", null), limit = req.param("limit", null), zona_id = req.param("zona_id", null), turno_id = req.param("turno_id", null), inicio = req.param("inicio", null), fin = req.param("fin", null), where = {};

		if (zona_id !== null && turno_id !== null) {
			where = {turno_id: turno_id, zona_id: zona_id, hora_incidencia: {
				'>=' : inicio + ' 00:00:00',
				'<=' : fin + ' 23:59:59'
			}};
		} else if (zona_id !== null && turno_id === null) {
			where = {zona_id: zona_id, hora_incidencia: {
				'>=' : inicio + ' 00:00:00',
				'<=' : fin + ' 23:59:59'
			}};
		} else if (zona_id === null && turno_id !== null){
			where = {turno_id: turno_id, hora_incidencia: {
				'>=' : inicio + ' 00:00:00',
				'<=' : fin + ' 23:59:59'
			}};
		} else {
			where = {hora_incidencia: {
				'>=' : inicio + ' 00:00:00',
				'<=' : fin + ' 23:59:59'
			}};
		}

		if(page && limit){
			Incidencia.find(where)
			.populate('zona_id')
			.populate('nivel_id')
			.populate('turno_id')
			.populate('factor_id')
			.sort('hora_incidencia ASC').paginate({page:page,limit:limit})
			.exec(function(error,data){
				return res.json(data);
			});
		}
		else
			return res.json([ ]);
	},
	zona_demandada: function (req, res) {
		Incidencia.query('select zona.zona, count(incidencia.incidencia_id) as total from incidencia inner join zona on zona.zona_id = incidencia.zona_id group by zona.zona_id order by total DESC limit 1', function (err, response) {
			if (err) return res.send(err,500);
  			res.json(response);
		});
	}
};

