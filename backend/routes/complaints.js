const express = require('express');
const router = express.Router();
const {
  getComplaints,
  getComplaint,
  createComplaint,
  updateComplaint,
  deleteComplaint,
  resolveComplaint
} = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', getComplaints);
router.get('/:id', getComplaint);
router.post('/', createComplaint);
router.put('/:id', updateComplaint);
router.put('/:id/resolve', authorize('admin'), resolveComplaint);
router.delete('/:id', deleteComplaint);

module.exports = router;

