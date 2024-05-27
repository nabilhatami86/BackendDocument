const express = require ('express');
const router = express.Router();
const { getDocument, createDocument, deleteDocument } = require ("../controller/documentController");
const { isAdmin } = require ('../middleware/middleware-authorization');

router.get("/", getDocument);
router.post('/',isAdmin, createDocument);
router.delete('/:id',isAdmin, deleteDocument);

module.exports = router