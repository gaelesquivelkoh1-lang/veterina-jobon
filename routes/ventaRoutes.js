const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/ventaController');
const { requiereLogin } = require('../middlewares/auth');

router.use(requiereLogin);

// Mostrar pantalla del punto de venta
router.get('/', ventaController.mostrarPuntoVenta);

// Ver historial de ventas
router.get('/historial', ventaController.mostrarHistorial);

// Resumen de ventas de hoy (API para el Punto de Venta)
router.get('/api/resumen-hoy', ventaController.resumenHoyAPI);

// Registrar una venta
router.post('/', ventaController.crearVenta);

module.exports = router;