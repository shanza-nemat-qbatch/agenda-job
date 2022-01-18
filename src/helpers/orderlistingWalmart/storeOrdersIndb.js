import {extend ,  } from 'lodash';
import mongoose from 'mongoose';
const {ObjectId} = mongoose.Types;

import orderDetails from "../../models/orderDetails";
import shippingInfo from "../../models/shippingDetails";
import postalAddress from "../../models/postalAddress";
import orderLines from "../../models/orderLine";

const addIDkeyValue = async (response, list , name) => {
   const newList = list.map((item) => {
      const obj= response.find((res) => {
         if (res.purchaseOrderId === item.purchaseOrderId) {
            return (res._id);
         }
      });
      let keyValue = {};
      if (name === 'saveShipping') {
             keyValue = { orderId : ObjectId(obj._id) };
      }
      if (name === 'savePostalAddress') {
         keyValue = { shippingId : ObjectId(obj._id) };
         delete item.purchaseOrderId;
         console.log("item" , item);

      }
      if (name === 'saveOrderLines') {
         keyValue = { postalAddressId : ObjectId(obj._id) };
         delete item.purchaseOrderId;
      }

      extend(item, keyValue);
      return item;

   });

   return newList;
}

const dis = () =>{
    reurn 
}

export const storeOrders = async (orders, ordersArray, shippingArray, postalAddressArray, orderLinesArray) => {
   try {
      const ordersResponse = await orderDetails.insertMany(ordersArray);
      const newShippingDeatils =  await addIDkeyValue(ordersResponse, shippingArray, 'saveShipping');
      const shippingResponse = await shippingInfo.insertMany(newShippingDeatils);
      const newPostalAddressDeatils =  await addIDkeyValue(shippingResponse, postalAddressArray, 'savePostalAddress');
      const postalAddressResponse = await postalAddress.insertMany(newPostalAddressDeatils);
      const newOrderLines = await addIDkeyValue(ordersResponse, orderLinesArray, 'saveOrderLines');
      const orderLinesResponse = await orderLines.insertMany(newOrderLines);
      const removeRespmse = await shippingInfo.updateMany({}, {$unset: {purchaseOrderId:1}} , {multi: true});

   } catch (error) {
      console.log("Error in save orders in db", error)
   }

}