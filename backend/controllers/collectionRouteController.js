const CollectionRoute = require('../models/CollectionRoute');
const WasteRequest = require('../models/WasteRequest');

// @desc    Get all collection routes
// @route   GET /api/collection-routes
// @access  Private
exports.getCollectionRoutes = async (req, res) => {
  try {
    let query = {};

    // Collectors can only see their own routes
    if (req.user.role === 'collector') {
      query.collector = req.user.id;
    }

    // Filter by status if provided
    if (req.query.status) {
      query.status = req.query.status;
    }

    const routes = await CollectionRoute.find(query)
      .populate('collector', 'name email phone')
      .populate('requests')
      .sort('-scheduledDate');

    res.json({
      success: true,
      count: routes.length,
      data: routes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching collection routes'
    });
  }
};

// @desc    Get single collection route
// @route   GET /api/collection-routes/:id
// @access  Private
exports.getCollectionRoute = async (req, res) => {
  try {
    const route = await CollectionRoute.findById(req.params.id)
      .populate('collector', 'name email phone')
      .populate('requests');

    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Collection route not found'
      });
    }

    // Check authorization
    if (req.user.role === 'collector' && route.collector._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this route'
      });
    }

    res.json({
      success: true,
      data: route
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching collection route'
    });
  }
};

// @desc    Create collection route
// @route   POST /api/collection-routes
// @access  Private/Admin, Collector
exports.createCollectionRoute = async (req, res) => {
  try {
    // Set collector to current user if not admin
    if (req.user.role === 'collector') {
      req.body.collector = req.user.id;
    }

    const route = await CollectionRoute.create(req.body);

    const populatedRoute = await CollectionRoute.findById(route._id)
      .populate('collector', 'name email phone')
      .populate('requests');

    res.status(201).json({
      success: true,
      message: 'Collection route created successfully',
      data: populatedRoute
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating collection route'
    });
  }
};

// @desc    Optimize collection route
// @route   POST /api/collection-routes/optimize
// @access  Private/Admin, Collector
exports.optimizeRoute = async (req, res) => {
  try {
    const { requestIds, startLocation } = req.body;

    // Fetch all requests
    const requests = await WasteRequest.find({
      _id: { $in: requestIds },
      status: { $in: ['pending', 'assigned'] }
    }).populate('user', 'address');

    if (requests.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid requests found for optimization'
      });
    }

    // Simple optimization: sort by distance from start location
    // In production, you would use a proper routing algorithm (e.g., TSP solver)
    const optimizedRequests = requests.sort((a, b) => {
      const distA = calculateDistance(
        startLocation.lat,
        startLocation.lng,
        a.address?.coordinates?.lat || 0,
        a.address?.coordinates?.lng || 0
      );
      const distB = calculateDistance(
        startLocation.lat,
        startLocation.lng,
        b.address?.coordinates?.lat || 0,
        b.address?.coordinates?.lng || 0
      );
      return distA - distB;
    });

    // Build route path
    const routePath = optimizedRequests.map((req, index) => ({
      lat: req.address?.coordinates?.lat || 0,
      lng: req.address?.coordinates?.lng || 0,
      order: index + 1
    }));

    // Calculate total distance
    let totalDistance = 0;
    for (let i = 0; i < routePath.length - 1; i++) {
      totalDistance += calculateDistance(
        routePath[i].lat,
        routePath[i].lng,
        routePath[i + 1].lat,
        routePath[i + 1].lng
      );
    }

    res.json({
      success: true,
      message: 'Route optimized successfully',
      data: {
        optimizedRequests: optimizedRequests.map(r => r._id),
        routePath,
        estimatedDistance: totalDistance,
        estimatedDuration: Math.round(totalDistance * 2) // Rough estimate: 2 minutes per km
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error optimizing route'
    });
  }
};

// @desc    Update collection route
// @route   PUT /api/collection-routes/:id
// @access  Private/Admin, Collector
exports.updateCollectionRoute = async (req, res) => {
  try {
    let route = await CollectionRoute.findById(req.params.id);

    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Collection route not found'
      });
    }

    // Check authorization
    if (req.user.role === 'collector' && route.collector.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this route'
      });
    }

    route = await CollectionRoute.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('collector', 'name email phone')
      .populate('requests');

    res.json({
      success: true,
      message: 'Collection route updated successfully',
      data: route
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating collection route'
    });
  }
};

// @desc    Delete collection route
// @route   DELETE /api/collection-routes/:id
// @access  Private/Admin
exports.deleteCollectionRoute = async (req, res) => {
  try {
    const route = await CollectionRoute.findById(req.params.id);

    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Collection route not found'
      });
    }

    await route.deleteOne();

    res.json({
      success: true,
      message: 'Collection route deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting collection route'
    });
  }
};

// Helper function to calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

