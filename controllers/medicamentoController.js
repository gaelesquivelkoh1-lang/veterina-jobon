const Medicamento = require('../models/Medicamento');

// Campos que se aceptan del formulario
function datosDelFormulario(body) {
  const {
    nombre, descripcion, presentacion, especie,
    precio_compra, precio_venta, stock, stock_minimo,
    lote, fecha_caducidad, requiere_receta, proveedor,
  } = body;

  return {
    nombre,
    descripcion: descripcion || null,
    presentacion: presentacion || null,
    especie: especie || null,
    precio_compra: precio_compra || null,
    precio_venta: precio_venta || null,
    stock: stock || 0,
    stock_minimo: stock_minimo || 0,
    lote: lote || null,
    fecha_caducidad: fecha_caducidad || null,
    requiere_receta: requiere_receta === 'on' || requiere_receta === 'true',
    proveedor: proveedor || null,
  };
}

// Mostrar todos los medicamentos
exports.listarMedicamentos = async (req, res) => {
  try {
    const medicamentos = await Medicamento.findAll({
      order: [['nombre', 'ASC']],
    });
    res.render('medicamentos/index', { medicamentos });
  } catch (error) {
    console.error('Error al listar medicamentos:', error);
    res.status(500).send('Error al cargar los medicamentos');
  }
};

// Mostrar formulario para crear un medicamento nuevo
exports.mostrarFormularioCrear = (req, res) => {
  res.render('medicamentos/nuevo');
};

// Guardar un medicamento nuevo
exports.crearMedicamento = async (req, res) => {
  try {
    await Medicamento.create(datosDelFormulario(req.body));
    res.redirect('/medicamentos');
  } catch (error) {
    console.error('Error al crear medicamento:', error);
    res.status(500).send('Error al guardar el medicamento');
  }
};

// Mostrar formulario para editar un medicamento existente
exports.mostrarFormularioEditar = async (req, res) => {
  try {
    const medicamento = await Medicamento.findByPk(req.params.id);
    if (!medicamento) {
      return res.status(404).send('Medicamento no encontrado');
    }
    res.render('medicamentos/editar', { medicamento });
  } catch (error) {
    console.error('Error al buscar medicamento:', error);
    res.status(500).send('Error al cargar el medicamento');
  }
};

// Actualizar un medicamento existente
exports.actualizarMedicamento = async (req, res) => {
  try {
    await Medicamento.update(datosDelFormulario(req.body), {
      where: { id: req.params.id },
    });
    res.redirect('/medicamentos');
  } catch (error) {
    console.error('Error al actualizar medicamento:', error);
    res.status(500).send('Error al actualizar el medicamento');
  }
};

// Eliminar un medicamento
exports.eliminarMedicamento = async (req, res) => {
  try {
    await Medicamento.destroy({ where: { id: req.params.id } });
    res.redirect('/medicamentos');
  } catch (error) {
    console.error('Error al eliminar medicamento:', error);
    res.status(500).send('Error al eliminar el medicamento');
  }
};

// Buscar medicamentos (para el punto de venta) - devuelve JSON
exports.buscarMedicamentosAPI = async (req, res) => {
  try {
    const { Op } = require('sequelize');
    const termino = req.query.q || '';

    const medicamentos = await Medicamento.findAll({
      where: {
        nombre: { [Op.like]: `%${termino}%` },
      },
      limit: 10,
      order: [['nombre', 'ASC']],
    });

    res.json(medicamentos);
  } catch (error) {
    console.error('Error al buscar medicamentos:', error);
    res.status(500).json({ error: 'Error al buscar medicamentos' });
  }
};