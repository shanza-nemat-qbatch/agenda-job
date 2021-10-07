import mongoose from 'mongoose'
import postalAddress from './postalAddress';
const { ObjectId } = mongoose.Schema.Types;

const Schema = mongoose.Schema({
    purchaseOrderId: {type : String},
    orderLine: {type: Array},
    postalAddressId: {
        type : ObjectId, 
        ref : postalAddress, 
        require: true 
    }
})
const orderLines = mongoose.model('WalmartOrderLine', Schema)
export default orderLines;