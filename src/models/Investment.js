const { DataTypes } = require('sequelize');
const sequelize = require('../config/connectDB');

const Investment = sequelize.define('Investment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id_fk: { type: DataTypes.INTEGER, allowNull: false },
    amount: { type: DataTypes.FLOAT, allowNull: false },
    roiCandtion: {
        type: DataTypes.INTEGER, // Or DataTypes.FLOAT if it needs to be a float
        allowNull: false, // Adjust based on whether it's a required field
      },
    status: { type: DataTypes.ENUM('Active', 'Inactive'), defaultValue: 'Inactive' },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW } // ✅ Manually added

}, {
    tableName: 'investments',
    timestamps: false
});

module.exports = Investment;