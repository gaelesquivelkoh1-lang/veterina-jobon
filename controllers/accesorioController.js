const Accesorio = require('../models/Accesorio');

// Mostrar todos los accesorios
exports.listarAccesorios = async (req, res) => {
  try {
    const accesorios = await Accesorio.findAll({
      order: [['nombre', 'ASC']],
    });
    res.render('accesorios/index', { accesorios });
  } catch (error) {
    console.error('Error al listar accesorios:', error);
    res.status(500).send('Error al cargar los accesorios');
  }
};

// Mostrar formulario para crear un accesorio nuevo
exports.mostrarFormularioCrear = (req, res) => {
  res.render('accesorios/nuevo');
};

// Guardar un accesorio nuevo
exports.crearAccesorio = async (req, res) => {
  try {
    const {
      nombre, categoria, precio_compra, precio_venta,
      stock, stock_minimo, proveedor,
      fecha_entrega, fecha_recibido,
    } = req.body;

    await Accesorio.create({
      nombre, categoria, precio_compra, precio_venta,
      stock, stock_minimo, proveedor,
      fecha_entrega: fecha_entrega || null,
      fecha_recibido: fecha_recibido || null,
    });

    res.redirect('/accesorios');
  } catch (error) {
    console.error('Error al crear accesorio:', error);
    res.status(500).send('Error al guardar el accesorio');
  }
};

// Mostrar formulario para editar un accesorio existente
exports.mostrarFormularioEditar = async (req, res) => {
  try {
    const accesorio = await Accesorio.findByPk(req.params.id);
    if (!accesorio) {
      return res.status(404).send('Accesorio no encontrado');
    }
    res.render('accesorios/editar', { accesorio });
  } catch (error) {
    console.error('Error al buscar accesorio:', error);
    res.status(500).send('Error al cargar el accesorio');
  }
};

// Actualizar un accesorio existente
exports.actualizarAccesorio = async (req, res) => {
  try {
    const {
      nombre, categoria, precio_compra, precio_venta,
      stock, stock_minimo, proveedor,
      fecha_entrega, fecha_recibido,
    } = req.body;

    await Accesorio.update(
      {
        nombre, categoria, precio_compra, precio_venta,
        stock, stock_minimo, proveedor,
        fecha_entrega: fecha_entrega || null,
        fecha_recibido: fecha_recibido || null,
      },
      { where: { id: req.params.id } }
    );

    res.redirect('/accesorios');
  } catch (error) {
    console.error('Error al actualizar accesorio:', error);
    res.status(500).send('Error al actualizar el accesorio');
  }
};

// Eliminar un accesorio
exports.eliminarAccesorio = async (req, res) => {
  try {
    await Accesorio.destroy({ where: { id: req.params.id } });
    res.redirect('/accesorios');
  } catch (error) {
    console.error('Error al eliminar accesorio:', error);
    res.status(500).send('Error al eliminar el accesorio');
  }
};

// Buscar accesorios (para el punto de venta) - devuelve JSON
exports.buscarAccesoriosAPI = async (req, res) => {
  try {
    const { Op } = require('sequelize');
    const termino = req.query.q || '';

    const accesorios = await Accesorio.findAll({
      where: {
        nombre: { [Op.like]: `%${termino}%` },
      },
      limit: 10,
      order: [['nombre', 'ASC']],
    });

    res.json(accesorios);
  } catch (error) {
    console.error('Error al buscar accesorios:', error);
    res.status(500).json({ error: 'Error al buscar accesorios' });
  }
};