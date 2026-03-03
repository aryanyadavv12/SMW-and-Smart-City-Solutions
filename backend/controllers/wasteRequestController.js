const WasteRequest = require('../models/WasteRequest');

// @desc    Get all waste requests
// @route   GET /api/waste-requests
// @access  Private
exports.getWasteRequests = async (req, res) => {
  try {
    let query = {};

    // Citizens can only see their own requests
    if (req.user.role === 'citizen') {
      query.user = req.user.id;
    }

    // Collectors can see assigned requests
    if (req.user.role === 'collector') {
      query.$or = [
        { assignedCollector: req.user.id },
        { status: 'pending' }
      ];
    }

    // Filter by status if provided
    if (req.query.status) {
      query.status = req.query.status;
    }

    const requests = await WasteRequest.find(query)
      .populate('user', 'name email phone address')
      .populate('assignedCollector', 'name email phone')
      .sort('-createdAt');

    res.json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching waste requests'
    });
  }
};

// @desc    Get single waste request
// @route   GET /api/waste-requests/:id
// @access  Private
exports.getWasteRequest = async (req, res) => {
  try {
    const request = await WasteRequest.findById(req.params.id)
      .populate('user', 'name email phone address')
      .populate('assignedCollector', 'name email phone');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Waste request not found'
      });
    }

    // Check authorization
    if (req.user.role === 'citizen' && request.user._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this request'
      });
    }

    res.json({
      success: true,
      data: request
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching waste request'
    });
  }
};

// @desc    Create waste request
// @route   POST /api/waste-requests
// @access  Private
exports.createWasteRequest = async (req, res) => {
  try {
    // Set user to current user if not admin
    if (req.user.role === 'citizen') {
      req.body.user = req.user.id;
    }

    const wasteRequest = await WasteRequest.create(req.body);

    const populatedRequest = await WasteRequest.findById(wasteRequest._id)
      .populate('user', 'name email phone address');

    res.status(201).json({
      success: true,
      message: 'Waste request created successfully',
      data: populatedRequest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating waste request'
    });
  }
};

// @desc    Update waste request
// @route   PUT /api/waste-requests/:id
// @access  Private
exports.updateWasteRequest = async (req, res) => {
  try {
    let request = await WasteRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Waste request not found'
      });
    }

    // Check authorization
    if (req.user.role === 'citizen' && request.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this request'
      });
    }

    // Don't allow status updates through this route
    delete req.body.status;
    delete req.body.assignedCollector;

    request = await WasteRequest.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('user', 'name email phone address')
      .populate('assignedCollector', 'name email phone');

    res.json({
      success: true,
      message: 'Waste request updated successfully',
      data: request
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating waste request'
    });
  }
};

// @desc    Assign collector to waste request
// @route   PUT /api/waste-requests/:id/assign
// @access  Private/Admin, Collector
exports.assignCollector = async (req, res) => {
  try {
    const request = await WasteRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Waste request not found'
      });
    }

    request.assignedCollector = req.body.collectorId;
    request.status = 'assigned';
    await request.save();

    const populatedRequest = await WasteRequest.findById(request._id)
      .populate('user', 'name email phone address')
      .populate('assignedCollector', 'name email phone');

    res.json({
      success: true,
      message: 'Collector assigned successfully',
      data: populatedRequest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error assigning collector'
    });
  }
};

// @desc    Update waste request status
// @route   PUT /api/waste-requests/:id/status
// @access  Private
exports.updateStatus = async (req, res) => {
  try {
    const request = await WasteRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Waste request not found'
      });
    }

    // Check authorization
    if (req.user.role === 'citizen' && request.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this request status'
      });
    }

    if (req.user.role === 'collector' && request.assignedCollector?.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this request status'
      });
    }

    request.status = req.body.status;
    
    if (req.body.status === 'completed') {
      request.completedAt = new Date();
    }

    await request.save();

    const populatedRequest = await WasteRequest.findById(request._id)
      .populate('user', 'name email phone address')
      .populate('assignedCollector', 'name email phone');

    res.json({
      success: true,
      message: 'Status updated successfully',
      data: populatedRequest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating status'
    });
  }
};

// @desc    Delete waste request
// @route   DELETE /api/waste-requests/:id
// @access  Private
exports.deleteWasteRequest = async (req, res) => {
  try {
    const request = await WasteRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Waste request not found'
      });
    }

    // Check authorization
    if (req.user.role === 'citizen' && request.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this request'
      });
    }

    await request.deleteOne();

    res.json({
      success: true,
      message: 'Waste request deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting waste request'
    });
  }
};

