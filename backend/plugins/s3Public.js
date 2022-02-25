var {S3Client, ListBucketsCommand, GetBucketAclCommand} = require('@aws-sdk/client-s3');

var ACL_ALL_USERS = 'http://acs.amazonaws.com/groups/global/AllUsers';
var ACL_AUTHENTICATED_USERS = 'http://acs.amazonaws.com/groups/global/AuthenticatedUsers';

const s3PublicAccess = async (accessId, secret) => {
    const dbClient = new S3Client( {region: 'us-east-1'},{apiVersion: '2006-03-01'}, {credentials: {aws_access_key_id: accessId, aws_secret_access_key: secret}});
    const command = new ListBucketsCommand({});
    let insecureAccess = [];
    try{
        let listBuckets = await dbClient.send(command);
        for(var i=0;i<listBuckets.Buckets.length;i++)
        {
            var bucketParams = {Bucket: listBuckets.Buckets[i].Name};
            const commandAcl = new GetBucketAclCommand(bucketParams);
            let getBucketAcl = await dbClient.send(commandAcl);
            var vulnerable = false;
            getBucketAcl.Grants.forEach((grant) => {
                if (grant.Grantee && grant.Grantee.Type === 'Group' &&
                    (grant.Grantee.URI === ACL_ALL_USERS || grant.Grantee.URI === ACL_AUTHENTICATED_USERS) &&
                    (grant.Permission === 'READ' || grant.Permission === 'READ_ACP' || grant.Permission === 'WRITE' || grant.Permission === 'WRITE_ACP' || grant.Permission === 'FULL_CONTROL')) {
                    vulnerable = true;
                }
            });
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
    s3PublicAccess,
};