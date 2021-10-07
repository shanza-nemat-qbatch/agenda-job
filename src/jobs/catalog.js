import "dotenv/config";

import Agenda from "../config/agenda-jobs";
import { JOB_STATES } from "../../constants";

import SellingPartnerAPI from 'amazon-sp-api'; 
const { SELLING_PARTNER_APP_CLIENT_ID,  SELLING_PARTNER_APP_CLIENT_SECRET, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_SELLING_PARTNER_ROLE } = process.env
Agenda.define(
  "catalog",
  { concurrency: 1, lockLifetime: 60 * 60000 },
  async (job, done) => {
    console.log("*********************************************************");
    console.log("*****************   Catalog Start   *******************");
    console.log("*********************************************************");
    try {
      
      const client = new SellingPartnerAPI({
        region: "eu",
        refresh_token: "Atzr|IwEBIIKXa5s5OMv0oEEhvFUHfzRFuKw7v3DkJ_T-T6LAhePV0sIKrfYk7DS0xvDRmhISnlVMOGG74M0k0j6cmmfYXnBm7nHH6mqFtDdP_wmgAmIhZDecoshs-hqDMSyTB_joceUqQU4I3rQx3ErHm7dsCL-VwfDjQizfZG-s3GthdHO_lCZv1ZJBK5FwORy04vpQA_af_YlhixTBUuKpFD1XYnhT1wZeNZcgmidXBKIl4xOzVQ05Jsb5pAMSQnssw-BgE0Tn-aOpBCMC63Re-b5H7FS09hamLmeMo7DajipV0Eo6M49RSdExYwhGWtBHbl2kOlI",
        credentials: {
          SELLING_PARTNER_APP_CLIENT_ID,
          SELLING_PARTNER_APP_CLIENT_SECRET,
          AWS_ACCESS_KEY_ID,
          AWS_SECRET_ACCESS_KEY,
          AWS_SELLING_PARTNER_ROLE
        }
      });
      const response = await client.callAPI({
        operation: 'listCatalogItems',
        query: {
          MarketplaceId: 'A1PA6795UKMFR9',
          Query: 'B00AP06III'
        },
        endpoint: 'catalogItems'
      });
      console.log("🚀 ~ file: catalog.js ~ line 34 ~ response", response)
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