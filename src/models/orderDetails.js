import mongoose from 'mongoose'

const Schema = mongoose.Schema({
    purchaseOrderId: { type : String},
    customerOrderId: { type : String},
    customerEmailId: { type : String}
})
const orderDetails = mongoose.model('Walmartorders', Schema)
export default orderDetails;