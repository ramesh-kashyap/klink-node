const { DataTypes } = require('sequelize');
const sequelize = require('../config/connectDB');

const Withdraw = sequelize.define('Withdraw', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id_fk: { type: DataTypes.INTEGER, allowNull: false },
    amount: { type: DataTypes.FLOAT, allowNull: false },
    status: { type: DataTypes.ENUM('Approved', 'Pending', 'Rejected'), defaultValue: 'Pending' },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW } // ✅ Manually added

    status: { type: DataTypes.ENUM('Active', 'Pending', 'Reject'), defaultValue: 'Pending' },
    wdate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      account: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      txn_id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true, // assuming txn_id is unique
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
}, {
    tableName: 'withdraws',
    timestamps: false
});

module.exports = Withdraw;