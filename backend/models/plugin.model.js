const { model, Schema } = require('mongoose');

// Schema for Plugins
const pluginSchema = new Schema({
  name: String,
  description: String,
  service: String,
  remediation: String,
  compliance: [String]
});

module.exports = model('Plugin', pluginSchema, 'plugins');
