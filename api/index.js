import axios from "axios";
import express from "express"



//const express = require("express");
const app = express();
const port = 8080;

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

// app.get("/getTransactionLog", async (req, res) => {
//     const response = await fetch(
//         `https://dev.smartjournal.net:443/um/test/api/jr/txn/log/v1`);
//     const data = await response.json()
//     res.send(data)
// })

app.get("/getTransactionTypeList", async (req, res) => {
    const response = await fetch(
        `https://dev.smartjournal.net:443/um/test/api/jr/txn/ttplist/v1`);
    const data = await response.json()
    res.send(data)
})

// app.get("/getAtmPastFutureTransactions", async (req, res) => {
//     const response = await fetch(
//         `https://dev.smartjournal.net:443/um/test/api/jr/txn/txnlist/v1`);
//     const data = await response.json()
//     res.send(data)
// })

app.listen(port, () => {
    console.log("server started on port 8080")
})