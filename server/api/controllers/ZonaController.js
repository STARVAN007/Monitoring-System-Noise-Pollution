/**
 * ZonaController
 *
 * @description :: Server-side logic for managing zonas
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	zonas_range: function  (req, res) {
		Zona.find().populate('incidencias', {hora_incidencia: { '>': new Date(req.param('inicio')), '<': new Date(req.param('fin')) }}).exec(function (err, zonas) {
			res.send(zonas);
		});
	},
   	count: function (req, res) {
		Zona.count().exec(function(error,count){
			return res.json({
			  count: count,
			});
		});
	},
	grid_zonas: function (req, res) {
		var page = req.param("page",null);
		var limit = req.param("limit",null);
		if(page && limit){
			Zona.find().paginate({page:page,limit:limit})
			.exec(function(error,data){
				return res.json(data);
			});
		}
		else
			return res.json([ ]);
	},
	borrar_zona: function (req, res) {
		Incidencia.count({zona_id: req.param('zona_id')}).exec(function (err, count) {
			if (count > 0) {
				res.json("No se puede eliminar zona porque existen incidencias registradas con estas zona ["+count+"]");
			} else {
				Zona.destroy({zona_id: req.param('zona_id')}).exec(function(err, zona) {
					if (err) return res.send(err,500);
					res.json("Se eliminó correctamente la zona");
				
				});
			}
		});
	},
	comparative_zonas : function (req, res) {
		Incidencia.query('select count(incidencia.incidencia_id) as promedio, concat(day(incidencia.hora_incidencia), "/", month(incidencia.hora_incidencia), "/", year(incidencia.hora_incidencia)) as dia, zona.zona from incidencia inner join zona on zona.zona_id = incidencia.zona_id where incidencia.hora_incidencia between "' + req.param('inicio') + ' 00:00:00" and "' + req.param('fin') + ' 23:59:59" group by incidencia.zona_id, day(incidencia.hora_incidencia) order by incidencia.hora_incidencia asc;', function (err, response) {
			if (err) return res.send(err,500);
  			res.json(response);
		});
	}
};

