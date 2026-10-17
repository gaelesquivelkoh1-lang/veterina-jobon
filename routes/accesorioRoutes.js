const express = require('express');
const router = express.Router();
const accesorioController = require('../controllers/accesorioController');
const { requiereLogin, requiereAdmin } = require('../middlewares/auth');

router.use(requiereLogin);

// ===== Cualquier usuario logueado (admin o vendedor) =====
router.get('/api/buscar', accesorioController.buscarAccesoriosAPI);

// Ver accesorios y agregar nuevos
router.get('/', accesorioController.listarAccesorios);
router.get('/nuevo', accesorioController.mostrarFormularioCrear);
router.post('/', accesorioController.crearAccesorio);

// ===== Solo administrador =====
router.get('/:id/editar', requiereAdmin, accesorioController.mostrarFormularioEditar);
router.post('/:id', requiereAdmin, accesorioController.actualizarAccesorio);
router.post('/:id/eliminar', requiereAdmin, accesorioController.eliminarAccesorio);

module.exports = router;