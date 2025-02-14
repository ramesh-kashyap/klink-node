const { DataTypes } = require('sequelize');
const sequelize = require('../config/connectDB');

const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING, allowNull: false },
    sponsor: { type: DataTypes.INTEGER, allowNull: true }, // Parent user (sponsor)
    active_status: { type: DataTypes.ENUM('Active', 'Inactive'), defaultValue: 'Inactive' },
    jdate: { type: DataTypes.DATEONLY, allowNull: false },
    // balance: { type: DataTypes.FLOAT, defaultValue: 0 },
}, {
    tableName: 'users',
    timestamps: false
});



module.exports = User;
