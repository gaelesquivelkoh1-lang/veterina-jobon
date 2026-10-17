const express = require('express');
const router = express.Router();
const medicamentoController = require('../controllers/medicamentoController');
const { requiereLogin, requiereAdmin } = require('../middlewares/auth');

router.use(requiereLogin); // todas las rutas requieren sesión

// ===== Cualquier usuario logueado (admin o vendedor) =====

// Buscar medicamentos (API para el punto de venta)
router.get('/api/buscar', medicamentoController.buscarMedicamentosAPI);

// Ver la lista y agregar medicamentos
router.get('/', medicamentoController.listarMedicamentos);
router.get('/nuevo', medicamentoController.mostrarFormularioCrear);
router.post('/', medicamentoController.crearMedicamento);

// ===== Solo administrador =====
router.get('/:id/editar', requiereAdmin, medicamentoController.mostrarFormularioEditar);
router.post('/:id', requiereAdmin, medicamentoController.actualizarMedicamento);
router.post('/:id/eliminar', requiereAdmin, medicamentoController.eliminarMedicamento);

module.exports = router;