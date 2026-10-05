const express = require('express');
const router = express.Router();
const accesorioController = require('../controllers/accesorioController');
const { requiereLogin, requiereAdmin } = require('../middlewares/auth');

router.use(requiereLogin);

// Buscar accesorios (API para el punto de venta) - cualquier usuario logueado
router.get('/api/buscar', accesorioController.buscarAccesoriosAPI);

// Las siguientes rutas requieren ser admin
router.get('/', requiereAdmin, accesorioController.listarAccesorios);
router.get('/nuevo', requiereAdmin, accesorioController.mostrarFormularioCrear);
router.post('/', requiereAdmin, accesorioController.crearAccesorio);
router.get('/:id/editar', requiereAdmin, accesorioController.mostrarFormularioEditar);
router.post('/:id', requiereAdmin, accesorioController.actualizarAccesorio);
router.post('/:id/eliminar', requiereAdmin, accesorioController.eliminarAccesorio);

module.exports = router;