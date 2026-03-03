const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getWasteStats,
  getCollectionStats,
  getComplaintStats
} = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/dashboard', authorize('admin'), getDashboardStats);
router.get('/waste', getWasteStats);
router.get('/collection', authorize('admin', 'collector'), getCollectionStats);
router.get('/complaints', getComplaintStats);

module.exports = router;

