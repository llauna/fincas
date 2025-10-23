// routes/empresaRoutes.js
const express = require('express');
const router = express.Router();
const empresaController = require('../controllers/empresaController');

router.get('/', empresaController.getEmpresas);
router.post('/', empresaController.createEmpresa);
router.put('/:id', empresaController.updateEmpresa); // ✅ PUT habilitado
router.delete('/:id', empresaController.deleteEmpresa); // ✅ DELETE habilitado

module.exports = router;


