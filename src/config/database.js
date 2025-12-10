const { Sequelize } = require('sequelize');
const mongoose = require('mongoose');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.PG_DATABASE,
    process.env.PG_USER,
    process.env.PG_PASSWORD,
    {
        host: process.env.PG_HOST,
        port: process.env.PG_PORT,
        dialect: 'postgres',
        logging: false,
        pool: { max: 5, min: 0, acquire: 30000, idle: 10000 }
    }
);

const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    }
};

const connectPostgreSQL = async () => {
    try {
        await sequelize.authenticate();
        console.log('PostgreSQL connected');
        await sequelize.sync({ alter: true });
    } catch (error) {
        console.error('PostgreSQL connection error:', error.message);
        process.exit(1);
    }
};

module.exports = { sequelize, mongoose, connectMongoDB, connectPostgreSQL };
