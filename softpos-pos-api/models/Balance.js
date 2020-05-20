const db = require("../config")
const Stock = require("./Stock")
const Product = require("./Product")

const table_name = "balance"

const BalanceModel = {
  getIndexBalance: (tableNo, callback) => {
    db.query(`select max(R_Index) R_Index from balance where R_Table = ? order by R_Index`, 
    [tableNo], 
    (err, rows) => {
      if(err) throw err
      rows.map(a => {
        let newIndex = a.R_Index ? a.R_Index.split("/") : '0'
        const id = (parseInt(newIndex[1]) || 0)+1
        if (id < 10) {
          newIndex = tableNo.toUpperCase() + "/00" + id;
        } else if (id < 100) {
          newIndex = tableNo.toUpperCase() + "/0" + id;
        } else if (id < 1000) {
          newIndex = tableNo.toUpperCase() + "/" + id;
        }
        return callback(null, newIndex)
      })
      if (rows.length === 0) {
        const newIndex = tableNo.toUpperCase()+'/001'
        return callback(null, newIndex)
      }
    })
  },
  findAll: (callback) => {
    return db.query(
      `select *  from ${table_name}`,
      callback
    )
  },
  findByTable: (tableNo, callback) => {
    return db.query(
      `select *  from ${table_name} where r_table=?`,
      [tableNo],
      callback
    )
  },
  create: (Balance, callback) => {
    const { emp, plucode, price, qty, macno } = Balance
    
    Stock.getStockName(plucode, macno, (err, rows) => {
      if (err) throw err
      if (rows.length === 0) {
        return BalanceModel.saveBalance(Balance, callback)
      }
      rows.map(stock => {
        Stock.updateSTKFileAdd(plucode, stock.StkCode, qty, (err1, rows1) => {
          if (err1) throw err1
          if (rows1.length === 0) {
            return BalanceModel.saveBalance(Balance, callback)
          }
          const currDate = new Date()
          const STCardBean = {
            S_No: `1 ${currDate.getHours()}:${currDate.getMinutes()}:${currDate.getSeconds()}`, 
            S_SubNo: '', 
            S_Que: 0, 
            S_PCode: plucode, 
            S_Stk: stock.StkCode, 
            S_In: 0, 
            S_Out: qty, 
            S_InCost: 0, 
            S_OutCost: qty*price,
            S_ACost: 0, 
            S_Rem: 'SAL', 
            S_User: emp, 
            S_Link: ''
          }
          Stock.saveSTCard(STCardBean, (err2, rows2) => {
            if (err2) throw err2
            return BalanceModel.saveBalance(Balance, callback)
          })
        })
      })
    })
  },
  empty: (callback) => {
    return db.query(`delete from ${table_name}`, callback)
  },
  saveBalance: (balance, callback) => {
    Product.findByCode(balance.plucode, (err, rows)=>{
      if (err) throw err
      if(rows.length===0){
        return callback(null, [])
      }
      rows.map(product => {
        const s_text = balance.s_text ? balance.s_text.split(','): []
        const opt = ['','','','','']
        s_text.map((data, id) => {
          opt[id] = data
        })
        return db.query(
          `insert into balance 
              (r_index, r_table, r_emp, r_plucode, r_pname, 
              r_unit, r_group, r_price, r_quan, r_total,
              r_date, macno, 
              R_Serve, R_PrintOK, R_KicOK, PosStk, R_Order,
              R_MemSum, R_MoveItem, R_MoveFlag, R_MovePrint, R_PrBath, 
              R_PrAmt, R_DiscBath, R_PrCuQuan, R_PrCuAmt, R_Redule,
              R_PItemNo, R_PKicQue, 
              R_Stock, R_Set, R_Vat, R_Status,
              R_Service, R_Discount, R_Normal, R_Type, R_Kic, 
              R_Opt1, R_Opt2, R_Opt3, R_Opt4, R_Opt5) 
            values 
              (?, ?, ?, ?, ?, 
              ?, ?, ?, ?, ?,
              now(), ?, 
              'N', 'N', 'N', 'Y', '0',
              'N', 'N', '0', 'N', 0, 
              0, 0, 0, 0, 0, 
              0, 0, 
              ?, ?, ?, ?,
              ?, ?, ?, ?, ?,
              ?, ?, ?, ?, ?)`,
          [
            balance.index, balance.table, balance.emp, balance.plucode, balance.pname, 
            product.PUnit1, product.PGroup, balance.price, balance.qty, balance.total, 
            balance.macno, product.PStock, product.PSet, product.PVat, product.PStatus,
            product.PService, product.PDiscount, product.PNormal, product.PType, product.PKic,
            opt[0],opt[1],opt[2],opt[3],opt[4]
          ], 
          callback)
      })
    })
  }
}

module.exports = BalanceModel
