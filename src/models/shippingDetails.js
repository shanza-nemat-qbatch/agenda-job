import mongoose from 'mongoose';
import orderDetails from './orderDetails';
const { ObjectId } = mongoose.Schema.Types;

const Schema = mongoose.Schema({
    purchaseOrderId:{ type : String},
    phone:{ type : String},
    estimatedDeliveryDate:{ type : String},
    estimatedShipDate:{ type : String},
    methodCode:{ type : String},
    orderId: { 
        type : ObjectId, 
        ref : orderDetails, 
        require: true 
    }
})
const shippingInfo = mongoose.model('WalmartShippingInfo', Schema)
export default shippingInfo;