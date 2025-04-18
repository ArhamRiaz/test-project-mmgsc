import axios from "axios";
import express from "express"
import cors from "cors"
import serverless from "serverless-http";



//const express = require("express");
const app = express();
const port = 3001;
app.use(express.json());

if (process.env.DEVELOPMENT) {
  app.use(cors());
}

app.get("/", (req, res) => {
    res.send("Hello !");
  });

app.get("/getAidList", async (req, res) => {
    const response = await fetch(
        `https://dev.smartjournal.net:443/um/test/api/jr/txn/aidlist/v1`);
    const data = await response.json()
    res.send(data)
})

app.get("/getAtmList", async (req, res) => {
    const response = await fetch(
        `https://dev.smartjournal.net:443/um/test/api/jr/txn/atmlist/v1`);
    const data = await response.json()
    res.send(data)
})

app.get("/getHostResponseList", async (req, res) => {
    const response = await fetch(
        `https://dev.smartjournal.net:443/um/test/api/jr/txn/hstlist/v1`);
    const data = await response.json()
    res.send(data)
})

app.get("/getTransactionLog/:atmid/:devtime", async (req, res) => {
    const atmid = req.params.atmid
    const devtime = req.params.devtime
    const response = await fetch(
        `https://dev.smartjournal.net:443/um/test/api/jr/txn/log/v1?a=${atmid}&t=${devtime}`);
    
    const data =   await response.text()
    
    res.send(data)
})

app.get("/getTransactionTypeList", async (req, res) => {
    const response = await fetch(
        `https://dev.smartjournal.net:443/um/test/api/jr/txn/ttplist/v1`);
    const data = await response.json()
    res.send(data)
})

app.get("/getAtmPastFutureTransactions/:atmid/:datetime", async (req, res) => {
    const atmid = req.params.atmid
    const datetime = req.params.datetime
    const response = await fetch(
        `https://dev.smartjournal.net:443/um/test/api/jr/txn/txnlist/${atmid}/${datetime}/v1`);
    const data = await response.json()
    data.d = parseInt(datetime);
    res.send(data)
})

app.post('/getTransactionListWithPost', async (req, res) => {
    try{

        const response = await fetch(
            `https://dev.smartjournal.net:443/um/test/api/jr/txn/v1`);
        const data = await response.json()

        res.send(data)
      } catch(err){
        res.status(400).send(`Error posting: ${err}`)
      }
    });

if (process.env.DEVELOPMENT) {
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
    }

export const handler = serverless(app);