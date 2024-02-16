import csv from 'csv-parser';
import fs from 'fs';
import { parentPort, workerData } from 'worker_threads';

const data = {
    agents: [],
  accounts: [],
    users: [],
    lobs: [],
    carriers: [],
      policies: [],
};

fs.createReadStream(workerData.filePath)
    .pipe(csv())
    .on('data', (row) => {

        data.agents.push({ agentName: row.agent });
        data.users.push({
            firstName: row.firstname,
            dob: new Date(row.dob),
            address: row.address,
            phone: row.phone,
            state: row.state,
            zip: row.zip,
            email: row.email,
            gender: row.gender,
            userType: row.userType
        });
        data.accounts.push({ accountName: row.account_name });
        data.lobs.push({ categoryName: row.category_name });
        data.carriers.push({ companyName: row.company_name });


        data.policies.push({

            policyNumber: row.policy_number,
            policyStartDate: new Date(row.policy_start_date),
            policyEndDate: new Date(row.policy_end_date)
            // Add more fields as needed
        });
    })
    .on('end', () => {
        // Send processed data to the main thread
        parentPort.postMessage(data);
    });
   

export default data;


