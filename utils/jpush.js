

const JPush = require("jpush-sdk");

exports.jpush=(message,data,[method,audience],type)=>{
    if(type=='C'){
        var client = JPush.buildClient('b7ca54c93c3a57726d69a28d', '2c3b5f2aede85179b305fc87');
    }else if(type=='D'){
        var client = JPush.buildClient('3913583599d55c43da9292b1', 'c4defb6b9e4aa7cc34d88b84');
    }
    let push;
    switch (method){
        case 'tag':
        push=JPush.tag(audience.toString());
        break;
        case 'all':
            push =JPush.ALL(audience.toString());
            break;
        case 'alias':
            push =JPush.alias(audience.toString());
            break;
        default:
            console.error("Jpush method error");
    }
    client.push().setPlatform('ios', 'android')
        .setAudience(push)
        .setNotification(`${message}`, JPush.android(message, null, 1))
        .setMessage(`${data}`)
        .setOptions(null, 600)
        .send(function(err, res) {
            if (err) {
                if (err instanceof JPush.APIConnectionError) {
                    console.log(err.message);
                    //Response Timeout means your request to the server may have already received, please check whether or not to push
                    console.log(err.isResponseTimeout);
                } else if (err instanceof  JPush.APIRequestError) {
                    console.log(err.message);
                }
            } else {
                console.log('Sendno: ' + res.sendno);
                console.log('Msg_id: ' + res.msg_id);
            }
        });
};







