const Complaint = require('../models/Complaint');

// @desc    Get all complaints
// @route   GET /api/complaints
// @access  Private
exports.getComplaints = async (req, res) => {
  try {
    let query = {};

    // Citizens can only see their own complaints
    if (req.user.role === 'citizen') {
      query.user = req.user.id;
    }

    // Filter by status if provided
    if (req.query.status) {
      query.status = req.query.status;
    }

    const complaints = await Complaint.find(query)
      .populate('user', 'name email phone')
      .populate('assignedTo', 'name email')
      .sort('-createdAt');

    res.json({
      success: true,
      count: complaints.length,
      data: complaints
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching complaints'
    });
  }
};

// @desc    Get single complaint
// @route   GET /api/complaints/:id
// @access  Private
exports.getComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('assignedTo', 'name email');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    // Check authorization
    if (req.user.role === 'citizen' && complaint.user._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this complaint'
      });
    }

    res.json({
      success: true,
      data: complaint
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching complaint'
    });
  }
};

// @desc    Create complaint
// @route   POST /api/complaints
// @access  Private
exports.createComplaint = async (req, res) => {
  try {
    // Set user to current user if not admin
    if (req.user.role === 'citizen') {
      req.body.user = req.user.id;
    }

    const complaint = await Complaint.create(req.body);

    const populatedComplaint = await Complaint.findById(complaint._id)
      .populate('user', 'name email phone')
      .populate('assignedTo', 'name email');

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully',
      data: populatedComplaint
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating complaint'
    });
  }
};

// @desc    Update complaint
// @route   PUT /api/complaints/:id
// @access  Private
exports.updateComplaint = async (req, res) => {
  try {
    let complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    // Check authorization
    if (req.user.role === 'citizen' && complaint.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this complaint'
      });
    }

    // Don't allow status updates through this route (use resolve endpoint)
    delete req.body.status;
    delete req.body.resolution;
    delete req.body.resolvedAt;

    complaint = await Complaint.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('user', 'name email phone')
      .populate('assignedTo', 'name email');

    res.json({
      success: true,
      message: 'Complaint updated successfully',
      data: complaint
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating complaint'
    });
  }
};

// @desc    Resolve complaint
// @route   PUT /api/complaints/:id/resolve
// @access  Private/Admin
exports.resolveComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    complaint.status = 'resolved';
    complaint.resolution = req.body.resolution;
    complaint.resolvedAt = new Date();
    await complaint.save();

    const populatedComplaint = await Complaint.findById(complaint._id)
      .populate('user', 'name email phone')
      .populate('assignedTo', 'name email');

    res.json({
      success: true,
      message: 'Complaint resolved successfully',
      data: populatedComplaint
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error resolving complaint'
    });
  }
};

// @desc    Delete complaint
// @route   DELETE /api/complaints/:id
// @access  Private
exports.deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    // Check authorization
    if (req.user.role === 'citizen' && complaint.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this complaint'
      });
    }

    await complaint.deleteOne();

    res.json({
      success: true,
      message: 'Complaint deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting complaint'
    });
  }
};

