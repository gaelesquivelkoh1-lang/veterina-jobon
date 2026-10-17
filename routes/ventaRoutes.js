const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/ventaController');
const calendarioController = require('../controllers/calendarioController');
const { requiereLogin } = require('../middlewares/auth');

router.use(requiereLogin);

// Mostrar pantalla del punto de venta
router.get('/', ventaController.mostrarPuntoVenta);

// Ver historial de ventas
router.get('/historial', ventaController.mostrarHistorial);

// Resumen de ventas de hoy (API para el Punto de Venta)
router.get('/api/resumen-hoy', ventaController.resumenHoyAPI);

// Días con ventas de un mes (API para el calendario)
router.get('/api/dias-con-ventas', calendarioController.diasConVentasAPI);

// Registrar una venta
router.post('/', ventaController.crearVenta);

module.exports = router;