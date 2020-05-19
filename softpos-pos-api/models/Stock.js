const db = require("../config/db")
const table_name = "stockfile"

const Stock = {
  getStockName: (pCode, macNo, callback) => {
      let stockName = ''
      db.query(`select PCode,PGroup,PDesc,POSStk, MSStk 
      from product where PActive = 'Y' and PStock = 'Y' and PCode = ?`, 
      [pCode], (err, results, fields) => {
        if (err) throw err
        results.map(row => {
            switch (row.POSStk) {
                case '0':
                    console.log('คลังหลัก ถูกกำหนดโดยตรงจาก Company')
                    db.query(`select PosStock from company`, (err0, results0, fields0) => {
                        if (err0) throw err0
                        results0.map(row0 => {
                            stockName = row0.PosStock
                            return db.query(`select *  from ${table_name} where StkCode = ?`, [stockName], callback)
                        })
                    })
                    break;
                case '1':
                    console.log('คลังเลือก ถูกกำหนดโดยแต่ละสาขา ซึ่งจะแยกเป็น ตัดตามสต็อกที่กำหนดโดย Table/POS')
                    db.query(`select PSelectStk from branch`, (err1, results1, fields1) => {
                        if (err1) throw err1
                        results1.map(row1 => {
                            switch (row1.PSelectStk) {
                                case 'P':
                                    db.query(`select TStock from poshwsetup where Terminal = ?`, 
                                    [macNo], (err11, results11, fields11) => {
                                        if (err11) throw err11
                                        results11.map(row11 => {
                                            stockName = row11.TStock
                                            return db.query(`select *  from ${table_name} where StkCode = ?`, [stockName], callback)
                                        })
                                    })
                                    break;
                                case 'T':
                                    db.query(`select Tcode, StkCode1, StkCode2 
                                    from tablefile where Tcode= = ?`, 
                                    [macNo], (err11, results11, fields11) => {
                                        if (err11) throw err11
                                        results11.map(row11 => {
                                            if (row11.StkCode1 !== '') {
                                                stockName = row11.StkCode1
                                                return db.query(`select *  from ${table_name} where StkCode = ?`, [stockName], callback)
                                            } else {
                                                stockName = row11.StkCode2
                                                return db.query(`select *  from ${table_name} where StkCode = ?`, [stockName], callback)
                                            }
                                        })
                                    })
                                    break;
                                default:
                                    break;
                            }
                        })
                    })
                    break;
                case '2':
                    console.log('คลังย่อย แต่ละสินค้าจะเป็นตัวกำหนดคลังในการตัดสต็อกเอง')
                    stockName = row.MSStk
                    return db.query(`select *  from ${table_name} where StkCode = ?`, [stockName], callback)
                default:
                    break;
            }
        })
    })
  },
  updateSTKFileAdd: (bpCode, stockCode, qty, callback) => {
    const month = 12 + new Date().getMonth() + 1
    db.query(`select BPCode from stkfile where BPCode = ? and BStk = ?`, (err, results, fields) => {
        if (err) throw err
        results.map(row => {
            const strBqtyCol = `BQty${month}`
            const strBqtyData = `BQty${month}-${qty}`
            return db.query(`UPDATE stkfile 
            set ${strBqtyCol}=? where BPCode=? and BStk=?`,
            [strBqtyData, bpCode, stockCode], callback)
        })
        if (results.length === 0) {
            const strBqtyCol = `BQty${month}`
            const strBqtyData = `BQty${month}-${qty}`
            return db.query(`INSERT INTO stkfile (BPCode, BStk, ${strBqtyCol}) 
                values(?, ?, ?)`, [bpCode, stockCode, strBqtyData], callback)
        }
    })
  },
  saveSTCard: (STCardBean, callback) => {
      const {
        S_Date, S_No, S_SubNo, S_Que, S_PCode, S_Stk, S_In, S_Out, S_InCost, S_OutCost,
        S_ACost, S_Rem, S_User, S_EntryDate, S_EntryTime, S_Link
      } = STCardBean

      return db.query(
          `insert into stcard 
          (S_Date, S_No, S_SubNo, S_Que, S_PCode, S_Stk, S_In, S_Out, S_InCost, S_OutCost,
           S_ACost, S_Rem, S_User, S_EntryDate, S_EntryTime, S_Link) 
          values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) `, 
          [S_Date, S_No, S_SubNo, S_Que, S_PCode, S_Stk, S_In, S_Out, S_InCost, S_OutCost,
            S_ACost, S_Rem, S_User, S_EntryDate, S_EntryTime, S_Link], 
          callback)
  }
}

module.exports = Stock