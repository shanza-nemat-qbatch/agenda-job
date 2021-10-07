import ListingData from "../../models/listingData";

export const saveDataInDb = async (report, region) => {
    const reportData = report.map((row) => {
        const {
            sku,
            asin,
            price,
            quantity,
            businessPrice,
            quantityPriceType,
            quantityLowerBound1,
            quantityPrice1,
            quantityLowerBound2,
            quantityPrice2,
            quantityLowerBound3,
            quantityPrice3,
            quantityLowerBound4,
            quantityPrice4,
            quantityLowerBound5,
            quantityPrice5,
            progressivePriceType,
            progressiveLowerBound1,
            progressivePrice1,
            progressiveLowerBound2,
            progressivePrice2,
            progressiveLowerBound3,
            progressivePrice3,
            minimumOrderQuantity,
            sellRemainder
        } = row;

        const setSelector = {
            sellerSku: sku,
            asin,
            price,
            quantity,
            businessPrice,
            quantityPriceType,
            quantityLowerBound1,
            quantityPrice1,
            quantityLowerBound2,
            quantityPrice2,
            quantityLowerBound3,
            quantityPrice3,
            quantityLowerBound4,
            quantityPrice4,
            quantityLowerBound5,
            quantityPrice5,
            progressivePriceType,
            progressiveLowerBound1,
            progressivePrice1,
            progressiveLowerBound2,
            progressivePrice2,
            progressiveLowerBound3,
            progressivePrice3,
            minimumOrderQuantity,
            sellRemainder
        }
        const filterr = {
            sellerSku: sku
        }
        return {
            updateOne: {
                filter: filterr,
                update: {
                    $set: setSelector,
                    $setOnInsert: {
                        createdAt: new Date()
                    }
                },
                upsert: true
            }
        };

    });
    if (reportData.length > 0) {
        return ListingData.bulkWrite(reportData);
    }
    return Promise.resolve();
}