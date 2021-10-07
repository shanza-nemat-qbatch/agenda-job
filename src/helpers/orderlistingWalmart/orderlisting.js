import {storeOrders} from './storeOrdersIndb'

export const parseOrders = async (orders) => {
      try {
             let Orders = [];
             let ordersArray = [];
             let shippingArray =[];
             let postalAddressArray =[];
             let orderLinesArray = [];
       for (let orderItem of orders) {

              const { purchaseOrderId, customerOrderId, customerEmailId, shippingInfo, orderLines } = orderItem
              const { phone, estimatedDeliveryDate, estimatedShipDate, methodCode, postalAddress } = shippingInfo;
              const { name, address1, address2, city, state, postalCode, country, addressType } = postalAddress
              const { orderLine } = orderLines;
              
              let orderObj = {
                     purchaseOrderId,
                     customerOrderId,
                     customerEmailId
              };
              let shippingInfoObj = {
                     purchaseOrderId,
                     phone,
                     estimatedDeliveryDate,
                     estimatedShipDate,
                     methodCode,
              };
              let postalAddressObj = {
                     purchaseOrderId,
                     name,
                     address1,
                     address2,
                     city,
                     state,
                     postalCode,
                     country,
                     addressType
              };
              
              let orderLineitem = [];

              for (let orderlineItem of orderLine) {
                     const { item, charges } = orderlineItem;
                     let tax = 0;
                     let price = 0;
                     let shipping = 0;
                     const charge = charges?.charge || [];
                     for (let i = 0; i < charge.length; i++) {
                            let chargee = charge[i];
                            if (chargee.chargeName === 'ItemPrice') {
                                   price = chargee.chargeAmount.amount;
                            }
                            if (chargee.chargeName === 'shipping') {
                                   shipping = chargee.chargeAmount.amount;
                            }
                            if (chargee?.tax) {
                                   tax = chargee.tax.taxAmount.amount;
                            }
                     }

                     const { productName, sku } = item;

                     let orderLineInfo = {
                            productName: productName || "",
                            sku,
                            price,
                            tax,
                            shipping,
                     };

                     orderLineitem.push(orderLineInfo);
              }
              
              let orderLinesObj = {
                     purchaseOrderId,
                     orderLine
              };

              Orders.push({ 
                     order: orderObj, 
                     shippingInfo: shippingInfoObj, 
                     postalAddress: postalAddressObj, 
                     orderLine: orderLineitem
               });
               ordersArray.push(orderObj);
               shippingArray.push(shippingInfoObj);
               postalAddressArray.push(postalAddressObj);
               orderLinesArray.push(orderLinesObj)
       }
       await storeOrders(Orders, ordersArray, shippingArray, postalAddressArray, orderLinesArray);
      } catch (error) {
        console.log("Error in Parse Orders" , error)   
      }
       
}









// "orderLine": [
//        {
//               "lineNumber": "1",
//               "item": {
//                      "productName": "Refine Toenail Scissors",
//                      "sku": "SKU-WM-242015"
//               },
//               "charges": {
//                      "charge": [
//                             {
//                                    "chargeType": "PRODUCT",
//                                    "chargeName": "ItemPrice",
//                                    "chargeAmount": {
//                                           "currency": "USD",
//                                           "amount": 9.94
//                                    },
//                                    "tax": {
//                                           "taxName": "Tax1",
//                                           "taxAmount": {
//                                                  "currency": "USD",
//                                                  "amount": 0.59
//                                           }
//                                    }
//                             }
//                      ]
//               },
//               "orderLineQuantity": {
//                      "unitOfMeasurement": "EACH",
//                      "amount": "1"
//               },
//               "statusDate": 1633523547156,
//               "orderLineStatuses": {
//                      "orderLineStatus": [
//                             {
//                                    "status": "Created",
//                                    "statusQuantity": {
//                                           "unitOfMeasurement": "EACH",
//                                           "amount": "1"
//                                    },
//                                    "cancellationReason": null,
//                                    "trackingInfo": null,
//                                    "returnCenterAddress": null
//                             }
//                      ]
//               },
//               "refund": null,
//               "fulfillment": {
//                      "fulfillmentOption": "DELIVERY",
//                      "shipMethod": "VALUE",
//                      "storeId": null,
//                      "pickUpDateTime": 1634842800000,
//                      "pickUpBy": null,
//                      "shippingProgramType": null
//               }
//        },

// ]