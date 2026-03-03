const express = require('express');
const router = express.Router();
const {
  getWasteRequests,
  getWasteRequest,
  createWasteRequest,
  updateWasteRequest,
  deleteWasteRequest,
  assignCollector,
  updateStatus
} = require('../controllers/wasteRequestController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', getWasteRequests);
router.get('/:id', getWasteRequest);
router.post('/', createWasteRequest);
router.put('/:id', updateWasteRequest);
router.put('/:id/assign', authorize('admin', 'collector'), assignCollector);
router.put('/:id/status', updateStatus);
router.delete('/:id', deleteWasteRequest);

module.exports = router;

