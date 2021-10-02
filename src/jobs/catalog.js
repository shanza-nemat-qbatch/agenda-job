import "dotenv/config";

import Agenda from "../config/agenda-jobs";
import { JOB_STATES } from "../../constants";

Agenda.define(
  "catalog",
  { concurrency: 1, lockLifetime: 60 * 60000 },
  async (job, done) => {
    console.log("*********************************************************");
    console.log("*****************   Catalog Start   *******************");
    console.log("*********************************************************");
    try {
      
      job.attrs.state = JOB_STATES.COMPLETED;
      job.attrs.lockedAt = null;
      job.attrs.progress = 100;
      await job.save();
      console.log("*****************************************************************");
      console.log("******************    Catalog COMPLETED   *****************");
      console.log( "*****************************************************************");
      console.log("*****************************************************************");
    } catch (error) {
      console.log("*****************************************************************");
      console.log("********************    Catalog RETRY   *******************");
      console.log("*****************************************************************");
      console.log(error.message);
      console.log("*****************************************************************");

      job.attrs.state = JOB_STATES.FAILED;
      job.attrs.failedAt = new Date();
      job.attrs.failReason = error.message;
      job.attrs.lockedAt = null;
      await job.save();
    }
    done();
  }
);