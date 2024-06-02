const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const port = 5000;

app.use(cors())
app.use(bodyParser.json());

// Настройка базы данных
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './example.db'
});

// модель для таблицы
const Product = sequelize.define('Product', {
    Id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    Title: {
        type: DataTypes.STRING
    },
    Price: {
        type: DataTypes.FLOAT
    },
    Description: {
        type: DataTypes.TEXT
    }
}, {
    timestamps: false // Отключаем автоматическое добавление полей createdAt и updatedAt
});

sequelize.sync();

// Маршруты API
app.get('/api/products', async (req, res) => {
    const products = await Product.findAll();
    res.json(products);
});

app.post('/api/products', async (req, res) => {
    const { Title, Price, Description } = req.body;
    const newProduct = await Product.create({ Title, Price, Description });
    res.json(newProduct);
});

app.put('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    const { Title, Price, Description } = req.body;
    await Product.update({ Title, Price, Description }, { where: { Id: id } });
    res.json({ success: true });
});

app.delete('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    await Product.destroy({ where: { Id: id } });
    res.json({ success: true });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
