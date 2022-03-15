const Plugin = require('../models/plugin.model');
const Account = require('../models/account.model');
const {s3PublicAccess} = require('../plugins/s3Public');
const {s3PolicyPublicAccess} = require('../plugins/s3PolicyPublic');
const {s3Unencrypted} = require('../plugins/s3Unencrypted');

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
    const {accountId} = req.body;
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

    }
    await Account.findOneAndUpdate({_id: accountId}, scanAccountUpdate);

    return res
        .status(200)
        .json({
            success: true,
            msg: 'Scanned successfully'
        });

};


module.exports = {
    registerAccount,
    scanAll
};
