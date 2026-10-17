const { Op } = require('sequelize');
const { Venta } = require('../models/index');

// Devuelve, para un mes (YYYY-MM), qué días tuvieron ventas
exports.diasConVentasAPI = async (req, res) => {
  try {
    const usuarioActual = req.session.usuario;
    const mes = req.query.mes || '';

    if (!/^\d{4}-\d{2}$/.test(mes)) {
      return res.status(400).json({ error: 'Mes inválido' });
    }

    const [anio, m] = mes.split('-').map(Number);
    const inicio = new Date(anio, m - 1, 1, 0, 0, 0);
    const fin = new Date(anio, m, 0, 23, 59, 59);

    const condicion = { fecha: { [Op.between]: [inicio, fin] } };

    // Un vendedor solo ve los días de sus propias ventas
    if (usuarioActual.rol !== 'admin') {
      condicion.usuarioId = usuarioActual.id;
    }

    const ventas = await Venta.findAll({ where: condicion, attributes: ['fecha', 'total'] });

    const dias = {};
    ventas.forEach(v => {
      const dia = new Date(v.fecha).getDate();
      if (!dias[dia]) dias[dia] = { cantidad: 0, total: 0 };
      dias[dia].cantidad += 1;
      dias[dia].total += parseFloat(v.total);
    });

    res.json(dias);
  } catch (error) {
    console.error('Error al cargar el calendario:', error);
    res.status(500).json({ error: 'Error al cargar el calendario' });
  }
};