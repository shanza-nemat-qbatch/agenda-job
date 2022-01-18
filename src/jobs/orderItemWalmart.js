import Agenda from "../config/agenda-jobs";

import axios from 'axios';
import { v4 as uuid } from 'uuid';
import QS from 'qs';
import {parseOrders} from '../helpers/orderlistingWalmart/orderlisting'

const credentials = {
    email: 'support@shopgreatdealsnow.com',
    consumerkey: 'fd4a35fa-5332-44c6-8e73-8978b4ffd72f',
    secretkey: 'ANKEDasS2HdY0kFm6dpHIb_ZGuCVPlzof8yKT8Ug7O5IGlSuxczwhRH11HFHXv0_DS1T6Yjhb6RvGYl81cGskBE',
    purchaseOrderId :'9862819932978'
}
const WALMART_BASE_URL = 'https://marketplace.walmartapis.com/v3';

const generateToken = async (consumerKey, secretKey) => {

    const requestBody = QS.stringify({ 'grant_type': 'client_credentials' });
    const signature = Buffer.from(`${consumerKey}:${secretKey}`).toString("base64")
    
    const header = {
        'WM_SVC.NAME': 'Walmart Marketplace',
        'WM_QOS.CORRELATION_ID': uuid(),
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${signature}`,
    };
    const token = await axios({
        method: 'POST',
        url: `${WALMART_BASE_URL}/token`,
        headers: header,
        data: requestBody
    });

    header["WM_SEC.ACCESS_TOKEN"] = token.data.access_token  //setting header's one feild here. 
    return header;
};


Agenda.define('singleOrderWalmart', { concurrency: 1, lockLifetime: 60 * 60000 },
    async (job, done) => {
        try {
            const header = await generateToken( credentials.consumerkey, credentials.secretkey );
            
            let orders = await axios({ 
                method:'GET',
                url:`${WALMART_BASE_URL}/orders/${credentials.purchaseOrderId}`,
                headers: header,
            });
            orders = [orders?.data?.order];
            console.log("Get Order by purchaseOrderId ", JSON.stringify(orders, null , 4));
            
            // console.log("....................orders............." , JSON.stringify(orders[0], null , 4))

        } catch (error) {
            console.log("**** HERE IN CATCH BLOCK ****", error.message)
        }

    });