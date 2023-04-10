const query = require('../db/db')
const {multipleColumnSet} = require('../utils/common.utils')
const Role = require('../utils/userRoles.utils')


class AllModel {
    find = async (params = {}, tableName) => {
        let sql = `SELECT * FROM ${tableName}`

        if (!Object.keys(params).length) {
            return await query(sql)
        }

        const {columnSet, values} = multipleColumnSet(params)
        sql += ` WHERE ${columnSet}`

        return await query(sql, [...values])
    }

    findOne = async (params, tableName) => {
        const {columnSet, values} = multipleColumnSet(params)

        const sql = `SELECT * FROM ${tableName} WHERE ${columnSet}`

        const result = await query(sql, [...values])
        
        return result[0]
    }

    create = async ({ name, email, password, phone, role = Role.Employee, status = "deactive"}, tableName) => {
        const u = await this.findOne({ email: email }, 'users')
        if (u) {
            if (u.name !==  "") {
                return 'email_exist'
            }
        }
        const sql = `INSERT INTO ${tableName}
        (name, email, password, phone, role, status) VALUES (?,?,?,?,?,?)`;

        const result = await query(sql, [name, email, password, phone, role, status]);
        let affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    }

    update = async (params, id, tableName) => {
        const { columnSet, values } = multipleColumnSet(params)
        
        const sql = `UPDATE ${tableName} SET ${columnSet} WHERE id = ?`;
        const result = await query(sql, [...values, id]);
        return result;
    }

    delete = async (id, tableName) => {
        const sql = `DELETE FROM ${tableName}
        WHERE id = ?`;
        const result = await query(sql, [id]);
        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    }

}

module.exports = new AllModel