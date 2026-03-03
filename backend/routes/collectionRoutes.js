const express = require('express');
const router = express.Router();
const {
  getCollectionRoutes,
  getCollectionRoute,
  createCollectionRoute,
  updateCollectionRoute,
  deleteCollectionRoute,
  optimizeRoute
} = require('../controllers/collectionRouteController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', getCollectionRoutes);
router.get('/:id', getCollectionRoute);
router.post('/', authorize('admin', 'collector'), createCollectionRoute);
router.post('/optimize', authorize('admin', 'collector'), optimizeRoute);
router.put('/:id', authorize('admin', 'collector'), updateCollectionRoute);
router.delete('/:id', authorize('admin'), deleteCollectionRoute);

module.exports = router;

