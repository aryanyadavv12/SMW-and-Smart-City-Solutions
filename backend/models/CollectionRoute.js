const mongoose = require('mongoose');

const collectionRouteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  collector: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  requests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WasteRequest'
  }],
  routePath: [{
    lat: Number,
    lng: Number,
    order: Number
  }],
  scheduledDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  estimatedDuration: {
    type: Number, // in minutes
    default: 0
  },
  actualDuration: {
    type: Number, // in minutes
    default: 0
  },
  distance: {
    type: Number, // in kilometers
    default: 0
  },
  startedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  vehicleInfo: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

collectionRouteSchema.index({ collector: 1, scheduledDate: 1 });
collectionRouteSchema.index({ status: 1, scheduledDate: 1 });

module.exports = mongoose.model('CollectionRoute', collectionRouteSchema);

