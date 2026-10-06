const express = require('express');
const router = express.Router();
const medicamentoController = require('../controllers/medicamentoController');
const { requiereLogin, requiereAdmin } = require('../middlewares/auth');

router.use(requiereLogin);

// Buscar medicamentos (API para el punto de venta) - cualquier usuario logueado
router.get('/api/buscar', medicamentoController.buscarMedicamentosAPI);

// Las siguientes rutas requieren ser admin
router.get('/', requiereAdmin, medicamentoController.listarMedicamentos);
router.get('/nuevo', requiereAdmin, medicamentoController.mostrarFormularioCrear);
router.post('/', requiereAdmin, medicamentoController.crearMedicamento);
router.get('/:id/editar', requiereAdmin, medicamentoController.mostrarFormularioEditar);
router.post('/:id', requiereAdmin, medicamentoController.actualizarMedicamento);
router.post('/:id/eliminar', requiereAdmin, medicamentoController.eliminarMedicamento);

module.exports = router;