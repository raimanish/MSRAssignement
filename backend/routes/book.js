const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book');
module.exports = router;

router.get('', bookController.getbooks);
router.get('/get_total_books', bookController.getTotalBoks);
router.post('',bookController.createBook);
router.put('/:id', bookController.updateBook);
router.delete('/:id', bookController.deleteBook);
router.get('/:id', bookController.getBook);