const express = require("express")
const router = express.Router()
const TextUtil = require("../utils")
const Task = require("../models/Balance")

router.get("/", (req, res, next) => {
  Task.findAll((err, rows) => {
    if (err) {
      res.status(500).json({ status: "Error", msg: err.sqlMessage || err.errno })
    } else {
      res.status(200).json({ data: rows })
    }
  })
})

router.get("/table/:tableNo", (req, res, next) => {
  const tableNo = req.params.tableNo
  Task.findByTable(tableNo, (err, rows) => {
    if (err) {
      res.status(500).json({ status: "Error", msg: err.sqlMessage || err.errno })
    } else {
      const result = []
      rows.map(item => {
        result.push({...item, R_PName: TextUtil.convAscii2Unicode(item.R_PName)});
      })
      res.status(200).json({ data: result })
    }
  })
})

router.get("/employee/:empCode", (req, res, next) => {
  const empCode = req.params.empCode
  Task.findByEmployee(empCode, (err, rows) => {
    if (err) {
      res.status(500).json({ status: "Error", msg: err.sqlMessage || err.errno })
    } else {
      res.status(200).json({ data: rows })
    }
  })
})

router.post("/create", (req, res, next) => {
  const { balance } = req.body
  const Balance = {
    index: balance.index, 
    table: balance.table_code, 
    emp: balance.emp_code, 
    plucode: balance.menu_code, 
    pname: balance.menu_name, 
    unit: balance.unit, 
    group: balance.group, 
    price: balance.price, 
    qty: balance.qty,
    total: balance.total_amount,
    s_text: balance.s_text,
    sub_code: balance.sub_code,
    r_etd: balance.r_etd,
    macno: balance.macno,
  }
  Task.create(Balance, (err, rows) => {
    if (err) {
      res.status(500).json({ status: "Error", msg: err.sqlMessage || err.errno })
    } else {
      res.status(200).json({ "Success": rows.affectedRows })
    }
  })
})

router.post("/reset_balance", (req, res, next) => {
    Task.empty((err, rows) => {
      if (err) {
        res.status(500).json({ status: "Error", msg: err.sqlMessage || err.errno })
      } else {
        res.status(200).json({ delete_count: rows.affectedRows })
      }
    })
})

router.post("/getIndex", (req, res, next) => {
  const tableNo = req.body.table_no
    Task.getIndexBalance(tableNo, (err, newIndex) => {
      if (err) {
        res.status(500).json({ status: "Error", msg: err.sqlMessage || err.errno })
      } else {
        res.status(200).json({ data: newIndex })
      }
    })
})

module.exports = router
