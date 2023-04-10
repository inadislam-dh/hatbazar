const dotenv = require('dotenv')
const mysql = require('mysql2')
dotenv.config()
const p = process.env

class DBConnection {
    constructor() {
        this.db = mysql.createPool({
            host: p.DB_HOST,
            user: p.DB_USERNAME,
            password: p.DB_PASSWORD,
            database: p.DB_DATABASE
        })

        this.checkConnection()
    }

    checkConnection() {
        this.db.getConnection((err, con) => {
            if (err) {
                if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                    console.error('Database connection was closed.')
                }
                if (err.code === 'ER_CON_COUNT_ERROR') {
                    console.error('Database has too many connections.')
                }
                if (err.code === 'ECONNREFUSED') {
                    console.error('Database connection was refused.')
                }
            }
            if (con) {
                con.release()
            }
            return
        })
    }

    query = async (sql, values) => {
        return new Promise((resolve, reject) => {
            const callback = (error, result) => {
                if (error) {
                    reject(error)
                    return
                }
                resolve(result)
            }
            this.db.execute(sql, values, callback)
        }).catch(err => {
            const mysqlErrorList = Object.keys(HttpStatusCodes)
            err.status = mysqlErrorList.includes(err.code) ? HttpStatusCodes[err.code] : err.status
            throw err
        })
    }
}

const HttpStatusCodes = Object.freeze({
    ER_TRUNCATED_WRONG_VALUE_FOR_FIELD: 422,
    ER_DUP_ENTRY: 409
})

module.exports = new DBConnection().query