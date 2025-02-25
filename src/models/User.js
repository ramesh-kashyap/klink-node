const { DataTypes } = require('sequelize');
const sequelize = require('../config/connectDB');

const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING, allowNull: false },
    sponsor: { type: DataTypes.INTEGER, allowNull: true }, // Parent user (sponsor)
    active_status: { type: DataTypes.ENUM('Active', 'Inactive'), defaultValue: 'Inactive' },
    jdate: { type: DataTypes.DATEONLY },
    date_of_birth: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },  
    
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    fullname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tpassword: {
        type: DataTypes.STRING,
        allowNull: false
    },
    PSR: {
        type: DataTypes.STRING,
        allowNull: false
    },
    TPSR: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sponsor: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    level: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    ParentId: {
        type: DataTypes.INTEGER,
        allowNull: true
    }

    
    // balance: { type: DataTypes.FLOAT, defaultValue: 0 },
}, {
    tableName: 'users',
    timestamps: false
});



module.exports = User;
