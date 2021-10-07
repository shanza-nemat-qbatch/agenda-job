import 'dotenv/config';
import express from 'express';
import Agenda from './src/config/agenda-jobs';
import Agendash from 'agendash';
import { createCatalogJob, CreateReport, OrderListingWalmart } from './src/helpers/jobs/create-jobs'
import setupDatabase from './src/config/database';
import applyMiddlewares from './src/middlewares';
import router from './src/routes';
import './src/jobs'

const app = express();

app.use("/dash", Agendash(Agenda));

setupDatabase();
applyMiddlewares(app);

app.use('/api/v1', router);

app.listen(process.env.PORT, async () => {
  console.log(`app is listening to port ${process.env.PORT}`);
  await Agenda._ready;
  console.log('🚀 Agenda Ready');
  await Agenda.start();
  console.log('🚀 Agenda Started');
  //createCatalogJob();
  //CreateReport();
  OrderListingWalmart();
});
export default app;