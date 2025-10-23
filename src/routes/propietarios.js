const express = require('express');
const router = express.Router();
const { getPropietarioById } = require('../controllers/propietarioController'); // Importa correctamente la función

// Definir la ruta
router.get('/:id', getPropietarioById); // Asegúrate de que `getPropietarioById` sea una función

module.exports = router;

