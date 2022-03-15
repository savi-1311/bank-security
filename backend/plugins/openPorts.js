var {EC2Client, DescribeSecurityGroupRulesCommand} = require('@aws-sdk/client-ec2');

const openPorts = async (accessId, secret) => {
    const dbClient = new EC2Client( {region: 'us-east-1'},{apiVersion: '2006-03-01'}, {credentials: {aws_access_key_id: accessId, aws_secret_access_key: secret}});
    const command = new DescribeSecurityGroupRulesCommand({});
    let response = {};
    let insecureAccess = [];
    let openPorts = [];
    try{
        let listSecurityGroupRules = await dbClient.send(command);
        for(var i=0;i<listSecurityGroupRules.SecurityGroupRules.length;i++)
        {
            var securityGroup = listSecurityGroupRules.SecurityGroupRules[i];
            var vulnerable = false;
            if(!securityGroup.IsEgress)
            {
                if((securityGroup.CidrIpv4 && securityGroup.CidrIpv4=='0.0.0.0/0') || (securityGroup.CidrIpv6 && securityGroup.CidrIpv6=='::/0'))
                {
                    vulnerable=true;
                    if(securityGroup.FromPort==-1)
                        openPorts.push("All Ports");
                    else if(securityGroup.FromPort==securityGroup.ToPort)
                    {
                        openPorts.push(securityGroup.FromPort.toString());
                    }
                    else
                    {
                        var range = securityGroup.FromPort.toString()+" - "+securityGroup.ToPort.toString();
                        openPorts.push(range);
                    }
                }
            }

            if(vulnerable)
            {
                insecureAccess.push(securityGroup.SecurityGroupRuleId);
            }
        }
        response.affectedResources = insecureAccess;
        response.exposedPorts = openPorts;
        return response;
    }catch(err){
        console.error(err);
        return response;
    }
    return response;
}

module.exports = {
    openPorts,
};