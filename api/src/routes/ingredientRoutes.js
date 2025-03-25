const express = require('express');
const router = express.Router();
const ingredientController = require('../controllers/ingredientController');

// Define routes for ingredients
router.post('/', ingredientController.create);
router.get('/', ingredientController.getAll);
router.post('/categories', ingredientController.getByCategories);
router.post('/import', ingredientController.importIngredients);
router.patch('/:id/rename', ingredientController.rename);
router.patch('/:id/instock', ingredientController.updateInStock);
router.patch('/bulk-instock', ingredientController.bulkUpdateInStock);
router.delete('/:id', ingredientController.delete);

module.exports = router;