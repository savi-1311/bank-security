const Plugin = require('../models/plugin.model');
const Account = require('../models/account.model');
const {s3PublicAccess} = require('../plugins/s3Public');
const {s3PolicyPublicAccess} = require('../plugins/s3PolicyPublic');
const {s3Unencrypted} = require('../plugins/s3Unencrypted');
const {openPorts} = require("../plugins/openPorts");

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
          account: account,
        msg: 'Registered you account. You can start scanning now!'
      });

};

const scanAll = async (req, res) => {
    const {accountId, userId} = req.body;
    const plugins = await Plugin.find({});
    const scanAccount = await Account.findOne({_id: accountId});
    var scanAccountUpdate = scanAccount;

    for(var i=0;i<5;i++)
    {
        if(plugins[i].name=="S3 Public Access")
        {
            var result = await s3PublicAccess(scanAccount.accessKey, scanAccount.secret);
            scanAccountUpdate.scanStatus[i].data.affectedResources = result;
        }

        if(plugins[i].name=="S3 Policy Public Access")
        {
            var result = await s3PolicyPublicAccess(scanAccount.accessKey, scanAccount.secret);
            scanAccountUpdate.scanStatus[i].data.affectedResources = result;
        }

        if(plugins[i].name=="S3 Unencrypted")
        {
            var result = await s3Unencrypted(scanAccount.accessKey, scanAccount.secret);
            scanAccountUpdate.scanStatus[i].data.affectedResources = result;
        }

        if(plugins[i].name=="Open Ports")
        {
            var result = await openPorts(scanAccount.accessKey, scanAccount.secret);
            if(result.affectedResources && result.exposedPorts)
            {
                scanAccountUpdate.scanStatus[i].data = result;
            }
        }

    }
    await Account.findOneAndUpdate({_id: accountId}, scanAccountUpdate);

    const accounts = await Account.find({_id: accountId});

    return res
        .status(200)
        .json({
            success: true,
            accounts: accounts
        });

};

const listAccounts = async (req, res) => {
    const {userId} = req.body;
    const accounts = await Account.find({createdBy: userId});
    const plugins = await Plugin.find({});
    let pluginMap = {};
    for(var i=0;i<plugins.length;i++)
        pluginMap[plugins[i]._id]=plugins[i];

    return res
        .status(200)
        .json({
            success: true,
            accounts: accounts,
            plugins: pluginMap
        });
};

module.exports = {
    registerAccount,
    scanAll,
    listAccounts
};
