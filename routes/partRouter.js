const express = require('express');
const router = express.Router();
const partsController = require('../controllers/partController');
const multer = require('multer');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    },
  });

const upload = multer({ storage: storage });

// Route to get all parts
router.get('/', partsController.getAllParts);
router.get('/:id', partsController.getPartById);

router.post('/', upload.single('image'), partsController.createPart);
router.put('/:id', upload.single('image'), partsController.updatePart);

router.delete('/:id', partsController.deletePart);

module.exports = router;
