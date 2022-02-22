const { model, Schema } = require('mongoose');

// Schema for Accounts
const clothSchema = new Schema({
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  name: String,
  accessKey: String,
  secret: String,
  scanStatus:{
    pluginId: {
      type: Schema.Types.ObjectId,
      ref: 'Plugin'
    },
    lastScanned: String,
    Data: {
      affectedResources: [String],
      ExposedPorts: [String],
    }
  },
});

module.exports = model('Account', clothSchema, 'accounts');
