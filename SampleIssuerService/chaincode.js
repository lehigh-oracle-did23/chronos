const axios = require('axios');



exports.getKeyFromDID = async (DID) => {
    let userPass = process.env.user + ":" + process.env.pass;

    var data = JSON.stringify({
        "chaincode": process.env.Chaincode,
        "args": [
          "GetPublicKeyById",
          DID
        ],
        "sync": true
      });
    let config = {
        url: process.env.ChaincodeUrl,
        method: 'post', 
        headers: {
            'Authorization': 'Basic YmFsYS52ZWxsYW5raUBvcmFjbGUuY29tOldlbGNvbWUjIzEyMzQ=',
            'Content-Type': 'application/json',
        }, 
        data: data
    }

    try
    {
        let res = await axios(config); 
        console.log(res.data.result.payload);
        return res.data.result.payload;
    }
    catch(err)
    {
        console.log(err);
        return null;
    }
    
    
}
