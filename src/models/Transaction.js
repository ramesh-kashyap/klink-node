const { DataTypes } = require('sequelize');
const sequelize = require('../config/connectDB');

const Transaction = sequelize.define('Transaction', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, foreignKey: true },

    user_id_fk: { type: DataTypes.INTEGER, allowNull: false },
    amount: { type: DataTypes.FLOAT, allowNull: false },
    comm: { type: DataTypes.FLOAT, allowNull: false },

    payment_mode: { type: DataTypes.INTEGER,  defaultValue: 0 },
    remark: { type: DataTypes.STRING, allowNull: false },

    status: { type: DataTypes.ENUM('Active', 'Inactive'), defaultValue: 'Inactive' },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW } // ✅ Manually added

}, {
    tableName: 'transactions',
    timestamps: false
});

module.exports = Transaction;