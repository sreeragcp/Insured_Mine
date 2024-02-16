import csv from "csv-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { Worker, isMainThread, parentPort } from "worker_threads";
import mongoose from "mongoose";
import Agent from "../model/agentModel.js";
import User from "../model/userModel.js";
import Account from "../model/usersAccountModel.js";
import LOB from "../model/policyCategoryModel.js";
import Carrier from "../model/carrierModel.js";
import Policy from "../model/policyModel.js";
import Lob from "../model/policyCategoryModel.js";

const upload = async (req, res) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Write file data to a temporary file
    const tempFilePath = path.join(__dirname, "temp");
    fs.writeFileSync(tempFilePath, req.files.file.data);

    const worker = new Worker(path.join(__dirname, "csvWorker.js"), {
      workerData: { filePath: tempFilePath },
    });

    worker.on("message", async (data) => {
      try {
        await insertDataIntoCollections(data);
        res.status(200).json({ message: "CSV data uploaded successfully" });
      } catch (error) {
        console.error("Error inserting data into collections:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    worker.on("error", (error) => {
      console.error("Worker thread error:", error);
      res.status(500).json({ message: "Internal server error" });
    });

    worker.on("exit", (code) => {
      if (code !== 0) {
        console.error("Worker thread stopped with exit code", code);
        res.status(500).json({ message: "Internal server error" });
      }
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const insertDataIntoCollections = async (incommingData) => {
  const pushToDatabase = async (data, index) => {
    return new Promise(async (resolve, reject) => {
      const userdata = incommingData.users[index];
      const accountsData = incommingData.accounts[index];
      const lobsData = incommingData.lobs[index];
      const carriersData = incommingData.carriers[index];
      const policiesData = incommingData.policies[index];

      const newdata = {
        agentName: data.agentName,
      };

      const existingAgent = await Agent.findOne({
        agentName: newdata.agentName,
      });
      const agentName = data.agentName;

      // Use findOneAndUpdate to insert or update the agent
      const agentResult = await Agent.findOneAndUpdate(
        { agentName },
        { $setOnInsert: { agentName } },
        { upsert: true, new: true }
      );

      // =============accounts section====================
      const accountsSave = new Account(accountsData);
      const accountsResult = await accountsSave.save();

      // =============user section====================
      //Given usercollection doesn't require agentId and useraccountId
      // userdata.agentId=agentresult._id
      // userdata.accountId=accountsResult._id
      const userSave = new User(userdata);
      const userResult = await userSave.save();

      // =============lobs section====================
      const lobSave = new Lob(lobsData);
      const lobResult = await lobSave.save();

      // =============carriers section====================
      const carriersSave = new Carrier(carriersData);
      const carriersResult = await carriersSave.save();

      // =============policies section====================
      policiesData.userId = userResult._id;
      policiesData.companyCollectionId = lobResult._id  
      policiesData.policyCategory = lobsData.categoryName;

      const policiesDataSave = new Policy(policiesData);
      const policiesDataResult = await policiesDataSave.save();
    });
  };

  const pushDataToDatabase = async (incommingData) => {
    try {
      const promises = incommingData.agents.map(async (data, index) => {
        await pushToDatabase(data, index);
      });

      await Promise.all(promises);

      console.log("All data pushed to database successfully");
    } catch (error) {
      console.error("Error pushing data to database:", error);
    }
  };
  pushDataToDatabase(incommingData);
};

export default { upload };
