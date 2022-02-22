const { model, Schema } = require('mongoose');

// Schema for Plugins
const clothSchema = new Schema({
  name: String,
  description: String,
  service: String,
  remediation: String
});

module.exports = model('Plugin', clothSchema, 'plugins');
