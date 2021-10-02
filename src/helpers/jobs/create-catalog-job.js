import Jobs from '../../models/jobs';
import Agenda from '../../config/agenda-jobs';

export const createCatalogJob = async () => {
  const catalogJob = await Jobs.findOne({name: "catalog"});
  if(!catalogJob) {
    console.log("~ catalog job created!")
    await Agenda.create('catalog')
    .repeatEvery('15 minutes')
    .save();
  }
}