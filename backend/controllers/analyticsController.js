const WasteRequest = require('../models/WasteRequest');
const CollectionRoute = require('../models/CollectionRoute');
const Complaint = require('../models/Complaint');
const User = require('../models/User');

// @desc    Get dashboard statistics
// @route   GET /api/analytics/dashboard
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalRequests,
      pendingRequests,
      completedRequests,
      totalRoutes,
      activeRoutes,
      totalComplaints,
      openComplaints
    ] = await Promise.all([
      User.countDocuments(),
      WasteRequest.countDocuments(),
      WasteRequest.countDocuments({ status: 'pending' }),
      WasteRequest.countDocuments({ status: 'completed' }),
      CollectionRoute.countDocuments(),
      CollectionRoute.countDocuments({ status: 'in-progress' }),
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: 'open' })
    ]);

    // Get requests by type
    const requestsByType = await WasteRequest.aggregate([
      {
        $group: {
          _id: '$requestType',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get requests by status
    const requestsByStatus = await WasteRequest.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get recent requests
    const recentRequests = await WasteRequest.find()
      .populate('user', 'name email')
      .sort('-createdAt')
      .limit(5);

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalRequests,
          pendingRequests,
          completedRequests,
          totalRoutes,
          activeRoutes,
          totalComplaints,
          openComplaints
        },
        requestsByType,
        requestsByStatus,
        recentRequests
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching dashboard stats'
    });
  }
};

// @desc    Get waste statistics
// @route   GET /api/analytics/waste
// @access  Private
exports.getWasteStats = async (req, res) => {
  try {
    let query = {};

    // Citizens can only see their own stats
    if (req.user.role === 'citizen') {
      query.user = req.user.id;
    }

    // Collectors can see assigned requests
    if (req.user.role === 'collector') {
      query.assignedCollector = req.user.id;
    }

    const [
      total,
      pending,
      assigned,
      inProgress,
      completed,
      cancelled
    ] = await Promise.all([
      WasteRequest.countDocuments(query),
      WasteRequest.countDocuments({ ...query, status: 'pending' }),
      WasteRequest.countDocuments({ ...query, status: 'assigned' }),
      WasteRequest.countDocuments({ ...query, status: 'in-progress' }),
      WasteRequest.countDocuments({ ...query, status: 'completed' }),
      WasteRequest.countDocuments({ ...query, status: 'cancelled' })
    ]);

    // Get requests by type
    const byType = await WasteRequest.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$requestType',
          count: { $sum: 1 },
          totalQuantity: { $sum: '$quantity' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        total,
        pending,
        assigned,
        inProgress,
        completed,
        cancelled,
        byType
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching waste stats'
    });
  }
};

// @desc    Get collection statistics
// @route   GET /api/analytics/collection
// @access  Private/Admin, Collector
exports.getCollectionStats = async (req, res) => {
  try {
    let query = {};

    // Collectors can only see their own routes
    if (req.user.role === 'collector') {
      query.collector = req.user.id;
    }

    const [
      total,
      scheduled,
      inProgress,
      completed
    ] = await Promise.all([
      CollectionRoute.countDocuments(query),
      CollectionRoute.countDocuments({ ...query, status: 'scheduled' }),
      CollectionRoute.countDocuments({ ...query, status: 'in-progress' }),
      CollectionRoute.countDocuments({ ...query, status: 'completed' })
    ]);

    // Get average duration and distance
    const avgStats = await CollectionRoute.aggregate([
      { $match: { ...query, status: 'completed' } },
      {
        $group: {
          _id: null,
          avgDuration: { $avg: '$actualDuration' },
          avgDistance: { $avg: '$distance' },
          totalDistance: { $sum: '$distance' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        total,
        scheduled,
        inProgress,
        completed,
        averageStats: avgStats[0] || { avgDuration: 0, avgDistance: 0, totalDistance: 0 }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching collection stats'
    });
  }
};

// @desc    Get complaint statistics
// @route   GET /api/analytics/complaints
// @access  Private
exports.getComplaintStats = async (req, res) => {
  try {
    let query = {};

    // Citizens can only see their own complaints
    if (req.user.role === 'citizen') {
      query.user = req.user.id;
    }

    const [
      total,
      open,
      inProgress,
      resolved,
      closed
    ] = await Promise.all([
      Complaint.countDocuments(query),
      Complaint.countDocuments({ ...query, status: 'open' }),
      Complaint.countDocuments({ ...query, status: 'in-progress' }),
      Complaint.countDocuments({ ...query, status: 'resolved' }),
      Complaint.countDocuments({ ...query, status: 'closed' })
    ]);

    // Get complaints by category
    const byCategory = await Complaint.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        total,
        open,
        inProgress,
        resolved,
        closed,
        byCategory
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching complaint stats'
    });
  }
};

