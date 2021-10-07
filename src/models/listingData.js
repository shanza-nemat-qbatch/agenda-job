import mongoose from 'mongoose'

const schema = mongoose.Schema({

    sellerSku: {
        type: String
    },
    asin: {
        type: String
    },
    price: {
        type: Number
    },
    quantity: {
        type: Number
    },
    businessPrice: {
        type: Number
    },
    quantityPriceType: {
        type: Number
    },
    quantityLowerBound1: {
        type: Number
    },
    quantityPrice1: {
        type: Number
    },
    quantityLowerBound2: {
        type: Number
    },
    quantityPrice2: {
        type: Number
    },
    quantityLowerBound3: {
        type: Number
    },
    quantityPrice3: {
        type: Number
    },
    quantityLowerBound4: {
        type: Number
    },
    quantityPrice4: {
        type: Number
    },
    quantityLowerBound5: {
        type: Number
    },
    quantityPrice5: {
        type: Number
    },
    progressivePriceType: {
        type: Number
    },
    progressiveLowerBound1: {
        type: Number
    },
    progressivePrice1: {
        type: Number
    },
    progressiveLowerBound2: {
        type: Number
    },
    progressivePrice2: {
        type: Number
    },
    progressiveLowerBound3: {
        type: Number
    },
    progressivePrice3: {
        type: Number
    },
    minimumOrderQuantity: {
        type: Number
    },
    sellRemainder: {
        type: Number
    },

}, { strict: false })
const ListingData = mongoose.model('listingData', schema);

export default ListingData;