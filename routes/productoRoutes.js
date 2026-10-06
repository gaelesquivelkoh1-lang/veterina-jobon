
const express = require('express');

const router = express.Router();

const productoController = require('../controllers/productoController');

const {
  requiereLogin,
  requiereAdmin,
  requiereAdminOVendedor
} = require('../middlewares/auth');

router.use(requiereLogin); // todas las rutas de aquí abajo requieren sesión

// Buscar productos (API para el punto de venta) - cualquier usuario logueado puede usarla
router.get('/api/buscar', productoController.buscarProductosAPI);

// Buscar alimentos Y accesorios juntos (API para el punto de venta)
router.get('/api/buscar-todo', productoController.buscarTodoAPI);

// Alertas de stock bajo - cualquier usuario logueado puede verla
router.get('/api/alertas', productoController.alertasStockAPI);

// Inventario - admin y vendedor
router.get('/', requiereAdminOVendedor, productoController.listarProductos);

// Agregar producto - admin y vendedor
router.get('/nuevo', requiereAdminOVendedor, productoController.mostrarFormularioCrear);
router.post('/', requiereAdminOVendedor, productoController.crearProducto);

// Editar producto - solo admin
router.get('/:id/editar', requiereAdmin, productoController.mostrarFormularioEditar);
router.post('/:id', requiereAdmin, productoController.actualizarProducto);

// Eliminar producto - solo admin
router.post('/:id/eliminar', requiereAdmin, productoController.eliminarProducto);

module.exports = router;

