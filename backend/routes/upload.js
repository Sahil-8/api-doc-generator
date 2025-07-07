const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const uploadController = require('../controllers/uploadController');

// Single file upload, field name: 'file'
router.post('/', upload.single('file'), uploadController.uploadFile);

// Generate PDF from parsed data
router.post('/generate-pdf', uploadController.generatePDF);

module.exports = router;
