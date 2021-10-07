import mongoose from 'mongoose'
import shippingInfo from './shippingDetails';
const { ObjectId } = mongoose.Schema.Types;

const Schema = mongoose.Schema({
    purchaseOrderId: { type : String},
    name: { type : String},
    address1: { type : String},
    address2: { type : String},
    city: { type : String},
    state: { type : String},
    postalCode: { type : String},
    country: { type : String},
    addressType: { type : String},
    shippingId:  {
        type : ObjectId, 
        ref : shippingInfo, 
        require: true 
    }
})
const postalAddress = mongoose.model('WalmartpostalAddress', Schema)
export default postalAddress;