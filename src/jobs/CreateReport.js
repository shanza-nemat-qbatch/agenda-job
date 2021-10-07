import "dotenv/config";

import Agenda from "../config/agenda-jobs";
import { JOB_STATES } from "../../constants";

import moment from 'moment'

import { parseTSV } from '../helpers/utils/parse'

import SellingPartnerAPI from 'amazon-sp-api';

import { saveDataInDb } from '../helpers/storeReport/ListingData'

const { SELLING_PARTNER_APP_CLIENT_ID, SELLING_PARTNER_APP_CLIENT_SECRET, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_SELLING_PARTNER_ROLE } = process.env
const region = 'eu';
const refresh_token = "Atzr|IwEBIIKXa5s5OMv0oEEhvFUHfzRFuKw7v3DkJ_T-T6LAhePV0sIKrfYk7DS0xvDRmhISnlVMOGG74M0k0j6cmmfYXnBm7nHH6mqFtDdP_wmgAmIhZDecoshs-hqDMSyTB_joceUqQU4I3rQx3ErHm7dsCL-VwfDjQizfZG-s3GthdHO_lCZv1ZJBK5FwORy04vpQA_af_YlhixTBUuKpFD1XYnhT1wZeNZcgmidXBKIl4xOzVQ05Jsb5pAMSQnssw-BgE0Tn-aOpBCMC63Re-b5H7FS09hamLmeMo7DajipV0Eo6M49RSdExYwhGWtBHbl2kOlI"

const client = new SellingPartnerAPI({
    region,
    refresh_token,
    credentials: {
        SELLING_PARTNER_APP_CLIENT_ID,
        SELLING_PARTNER_APP_CLIENT_SECRET,
        AWS_ACCESS_KEY_ID,
        AWS_SECRET_ACCESS_KEY,
        AWS_SELLING_PARTNER_ROLE
    }
});

const getResult = async (reportId) => {
    return new Promise((resolve) => {
        var getReportInterval = setInterval(async () => {
            const resportRes = await client.callAPI({
                operation: 'getReport',
                endpoint: 'reports',
                path: {
                    reportId
                }
            })
            if (resportRes.processingStatus === 'DONE') {
                clearInterval(getReportInterval);
                resolve(resportRes);
            }
        }, 3600);
    })

}

Agenda.define(
    "createReport",
    { concurrency: 1, lockLifetime: 60 * 60000 },
    async (job, done) => {
        console.log("*********************************************************");
        console.log("*************   CREATE_REPORT Start   *******************");
        console.log("*********************************************************");
        try {
            const response = await client.callAPI({
                operation: 'createReport',
                endpoint: 'reports',
                body: {
                    reportType: 'GET_FLAT_FILE_OPEN_LISTINGS_DATA',
                    marketplaceIds: ['A1PA6795UKMFR9']  // Germany
                }
            });
            console.log(".....................................")
            if (response && response.reportId) {
                console.log("here in get report");
                try {
                    const getReport = await getResult(response.reportId);
                    console.log("🚀 ~ file: GetReport .js ~ line 69 ~ getReport", getReport.reportDocumentId)
                    try {
                        const getReportDoc = await client.callAPI({
                            operation: 'getReportDocument',
                            endpoint: 'reports',
                            path: {
                                reportDocumentId: getReport.reportDocumentId
                            }
                        })

                        if (getReportDoc) {
                            try {
                                const url = getReportDoc.url
                                console.log("🚀 ~ url  ", url)

                                let report = await client.download(getReportDoc);
                                report = await parseTSV(report);
                                console.log("🚀 ~ file: GetReportDocumnet.js ~ line 69 ~ report ", report)

                                await saveDataInDb(report, region)

                            } catch (error) {
                                console.log("here in catch block", error)
                                job.attrs.nextRunAt = moment().add(30 * 1000, 'millisecond').toDate();
                            }
                        }

                    } catch (error) {
                        console.log("here in catch block", error)
                        job.attrs.nextRunAt = moment().add(30 * 1000, 'millisecond').toDate();
                    }

                } catch (error) {
                    console.log("here in catch block", error)
                    job.attrs.nextRunAt = moment().add(30 * 1000, 'millisecond').toDate();
                }
            }

            job.attrs.state = JOB_STATES.COMPLETED;
            job.attrs.lockedAt = null;
            job.attrs.progress = 100;
            await job.save();
            console.log("*****************************************************************");
            console.log("****   CREATED-GET-DOC-DOWNLOAD-STORE_IN_DB-REPORT COMPLETED  ****");
            console.log("******************************************************************");
            console.log("******************************************************************");



        } catch (error) {
            console.log("*****************************************************************");
            console.log("********************    CREATE-REPOR RETRY   *******************");
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