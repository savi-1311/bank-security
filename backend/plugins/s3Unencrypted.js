var {S3Client, ListBucketsCommand, GetBucketEncryptionCommand} = require('@aws-sdk/client-s3');
const {get} = require("mongoose");

const s3Unencrypted = async (accessId, secret) => {
    const dbClient = new S3Client( {region: 'us-east-1'},{apiVersion: '2006-03-01'}, {credentials: {aws_access_key_id: accessId, aws_secret_access_key: secret}});
    const command = new ListBucketsCommand({});
    let insecureAccess = [];
    try{
        let listBuckets = await dbClient.send(command);
        for(var i=0;i<listBuckets.Buckets.length;i++)
        {
            var bucketParams = {Bucket: listBuckets.Buckets[i].Name};
            const commandEncryption = new GetBucketEncryptionCommand(bucketParams);
            var vulnerable = false;
            try{
                let getBucketEncryption = await dbClient.send(commandEncryption);
            }catch(encryptionError)
            {
                if(encryptionError.Code=="ServerSideEncryptionConfigurationNotFoundError")
                    vulnerable=true;
            }
            if(vulnerable)
            {
                insecureAccess.push(listBuckets.Buckets[i].Name)
            }
        }
        return insecureAccess;
    }catch(err){
        console.error(err.Code);
        return insecureAccess;
    }
    return insecureAccess;
}

module.exports = {
    s3Unencrypted,
};