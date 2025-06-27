import config from '../config/index.js'
import axios from "axios";
export const sendOTPbyKarimov= async (phoneNumber,message,token=config.SMS_TOKEN)=>{
    const options = {
    method: 'POST',
    url: 'https://sms.codearch.uz/api/v1/sendMessage',
    headers: {'Content-Type': 'application/json', Accept: 'application/json'},
    data: {
        "api_key":token,
        "phone": phoneNumber,
        "message": message
    }
    };
    
    try {
        const { data } = await axios.request(options);
        console.log(data);
        return true
    } catch (error) {
        console.error(error);
        return false
    };
};

