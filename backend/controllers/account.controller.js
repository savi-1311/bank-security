const Plugin = require('../models/plugin.model');
const Account = require('../models/account.model');
const generatePassword = require('generate-password');
const savePassword = require('../services/password.service');
const utils = require('../services/auth.service');

const { configClient } = require('../configs/client.config');
const CLIENT_URL = configClient();

// adds new account for the logged in user
const registerAccount = async (req, res) => {
  const {name, userId, accessKey, secret} = req.body;
  var scanStatus = [];
  const plugins = await Plugin.find({});

  for(var i=0;i<plugins.length;i++)
  {
      var scanStatusObj = {
          pluginId: plugins[i]._id,
          data:{
              affectedResources: [],
              exposedPorts: []
          }
      }
      scanStatus.push(scanStatusObj);
  }

  const newAccount = new Account({
    name: name,
    createdBy: userId,
    accessKey: accessKey,
    secret: secret,
      scanStatus: scanStatus
  });

  const account = await newAccount.save();

  return res
      .status(200)
      .json({
        success: true,
        msg: 'Registered you account. You can start scanning now!'
      });

};


module.exports = {
  registerAccount,
};
