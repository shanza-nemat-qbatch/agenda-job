import Jobs from '../../models/jobs';
import Agenda from '../../config/agenda-jobs';

export const createCatalogJob = async () => {
  const catalogJob = await Jobs.findOne({ name: "catalog" });
  if (!catalogJob) {
    console.log("~ catalog job created!")
    await Agenda.create('catalog')
      .repeatEvery('15 minutes')
      .save();
  }
}

export const CreateReport = async () => {
  const createReportJob = await Jobs.findOne({ name: 'createReport' });
  console.log("~ CreateReport job created!")
  if (!createReportJob) {
    await Agenda.create('createReport')
      .repeatEvery('15 minutes')
      .save();
  }
}

export const OrderListingWalmart = async () =>{ 
  const orderListingWalmartJob = await Jobs.findOne({name: 'orderListingWalmart'});
  console.log("~create job for order listing walmart");
 // if (!orderListingWalmartJob) {
    await Agenda.create('orderListingWalmart')
    .repeatEvery('15 minutes')
    .save();
 // }
}