const { model, Schema } = require('mongoose');

// Schema for Accounts
const accountSchema = new Schema({
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  name: String,
  accessKey: String,
  secret: String,
  scanStatus:[
    {
      pluginId: {
        type: Schema.Types.ObjectId,
        ref: 'Plugin'
      },
      data: {
        affectedResources: [String],
        exposedPorts: [String],
      }
    }],
});

module.exports = model('Account', accountSchema, 'accounts');
