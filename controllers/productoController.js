const Producto = require('../models/Producto');
const { Op } = require('sequelize');

// Mostrar todos los productos (inventario)
exports.listarProductos = async (req, res) => {
  try {
    const productos = await Producto.findAll({
      order: [['nombre', 'ASC']],
    });
    res.render('productos/index', { productos });
  } catch (error) {
    console.error('Error al listar productos:', error);
    res.status(500).send('Error al cargar los productos');
  }
};

// Mostrar formulario para crear un producto nuevo
exports.mostrarFormularioCrear = (req, res) => {
  res.render('productos/nuevo');
};

// Guardar un producto nuevo (viene del formulario)
exports.crearProducto = async (req, res) => {
  try {
    const {
      nombre, marca, categoria, peso_saco,
      precio_kilo, precio_saco, precio_compra,
      stock_kilos, stock_minimo, proveedor,
      fecha_entrega, fecha_recibido,
    } = req.body;

    await Producto.create({
      nombre, marca, categoria, peso_saco,
      precio_kilo, precio_saco, precio_compra,
      stock_kilos, stock_minimo, proveedor,
      fecha_entrega: fecha_entrega || null,
      fecha_recibido: fecha_recibido || null,
    });

    res.redirect('/productos');
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).send('Error al guardar el producto');
  }
};

// Mostrar formulario para editar un producto existente
exports.mostrarFormularioEditar = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) {
      return res.status(404).send('Producto no encontrado');
    }
    res.render('productos/editar', { producto });
  } catch (error) {
    console.error('Error al buscar producto:', error);
    res.status(500).send('Error al cargar el producto');
  }
};

// Actualizar un producto existente
exports.actualizarProducto = async (req, res) => {
  try {
    const {
      nombre, marca, categoria, peso_saco,
      precio_kilo, precio_saco, precio_compra,
      stock_kilos, stock_minimo, proveedor,
      fecha_entrega, fecha_recibido,
    } = req.body;

    await Producto.update(
      {
        nombre, marca, categoria, peso_saco,
        precio_kilo, precio_saco, precio_compra,
        stock_kilos, stock_minimo, proveedor,
        fecha_entrega: fecha_entrega || null,
        fecha_recibido: fecha_recibido || null,
      },
      { where: { id: req.params.id } }
    );

    res.redirect('/productos');
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).send('Error al actualizar el producto');
  }
};

// Eliminar un producto
exports.eliminarProducto = async (req, res) => {
  try {
    await Producto.destroy({ where: { id: req.params.id } });
    res.redirect('/productos');
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).send('Error al eliminar el producto');
  }
};

// Buscar productos (para el punto de venta) - devuelve JSON
exports.buscarProductosAPI = async (req, res) => {
  try {
    const termino = req.query.q || '';

    const productos = await Producto.findAll({
      where: {
        nombre: { [Op.like]: `%${termino}%` },
      },
      limit: 10,
      order: [['nombre', 'ASC']],
    });

    res.json(productos);
  } catch (error) {
    console.error('Error al buscar productos:', error);
    res.status(500).json({ error: 'Error al buscar productos' });
  }
};

// Buscar alimentos Y accesorios juntos (para el punto de venta)
exports.buscarTodoAPI = async (req, res) => {
  try {
    const Accesorio = require('../models/Accesorio');
    const termino = req.query.q || '';

    const alimentos = await Producto.findAll({
      where: { nombre: { [Op.like]: `%${termino}%` } },
      limit: 8,
      order: [['nombre', 'ASC']],
    });

    const accesorios = await Accesorio.findAll({
      where: { nombre: { [Op.like]: `%${termino}%` } },
      limit: 8,
      order: [['nombre', 'ASC']],
    });

    // Le agregamos una etiqueta "tipo" a cada resultado para diferenciarlos en el frontend
    const resultado = [
      ...alimentos.map(a => ({ ...a.toJSON(), tipo: 'alimento' })),
      ...accesorios.map(a => ({ ...a.toJSON(), tipo: 'accesorio' })),
    ];

    res.json(resultado);
  } catch (error) {
    console.error('Error al buscar:', error);
    res.status(500).json({ error: 'Error al buscar' });
  }
};

// Obtener productos con stock bajo (para la alerta)
exports.alertasStockAPI = async (req, res) => {
  try {
    const productos = await Producto.findAll();
    const bajos = productos.filter(p =>
      parseFloat(p.stock_kilos) <= parseFloat(p.stock_minimo)
    );
    res.json(bajos);
  } catch (error) {
    console.error('Error al obtener alertas de stock:', error);
    res.status(500).json({ error: 'Error al obtener alertas' });
  }
};