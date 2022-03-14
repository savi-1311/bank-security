var {S3Client, ListBucketsCommand, GetBucketPolicyCommand} = require('@aws-sdk/client-s3');

const s3PolicyPublicAccess = async (accessId, secret) => {
    const dbClient = new S3Client( {region: 'us-east-1'},{apiVersion: '2006-03-01'}, {credentials: {aws_access_key_id: accessId, aws_secret_access_key: secret}});
    const command = new ListBucketsCommand({});
    let insecureAccess = [];
    try{
        let listBuckets = await dbClient.send(command);
        for(var i=0;i<listBuckets.Buckets.length;i++)
        {
            var bucketParams = {Bucket: listBuckets.Buckets[i].Name};
            const commandPolicy = new GetBucketPolicyCommand(bucketParams);
            let getBucketPolicy = await dbClient.send(commandPolicy);
            var vulnerable = false;
            if(getBucketPolicy.Policy)
            {
                let S3Policy = getBucketPolicy.Policy;
                let S3PolicyStatemets = JSON.parse(S3Policy).Statement;
                for( var j=0;j<S3PolicyStatemets.length;j++)
                {
                    if(S3PolicyStatemets[j].Effect=="Allow")
                    {
                        if(S3PolicyStatemets[j].Principal=="*" || (Array.isArray(S3PolicyStatemets[j].Principal) && S3PolicyStatemets[j].Principal.includes("*")))
                            vulnerable=true;
                    }
                    if(vulnerable)
                        break;
                }

            }

            if(vulnerable)
            {
                insecureAccess.push(listBuckets.Buckets[i].Name)
            }
        }
        return insecureAccess;
    }catch(err){
        console.error(err);
        return insecureAccess;
    }
    return insecureAccess;
}

module.exports = {
    s3PolicyPublicAccess,
};