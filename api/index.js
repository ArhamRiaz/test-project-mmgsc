import axios from "axios";
import express from "express"
import cors from "cors"



//const express = require("express");
const app = express();
const port = 8080;
app.use(cors());

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

app.listen(port, () => {
    console.log("server started on port 8080")
})