const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const port = 5000;

// разрешаем запросы крос доменные
app.use(cors())
// добавляем преобразование данных из json в объекты
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

// Маршруты API именно по ним обращается фронт для работы с данными
//Получить все записи
app.get('/api/products', async (req, res) => {
    const products = await Product.findAll();
    res.json(products);
});
//Добавить запись
app.post('/api/products', async (req, res) => {
    const { Title, Price, Description } = req.body;
    const newProduct = await Product.create({ Title, Price, Description });
    res.json(newProduct);
});
//изменить запись. на месте ':id' будет подставленно число, ид записи
app.put('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    const { Title, Price, Description } = req.body;
    //Создается объект { Title, Price, Description } и 
    //обнаовляет все объекты где Id == id который прише в маршруте
    await Product.update({ Title, Price, Description }, { where: { Id: id } });
    res.json({ success: true });
});
//удалить запись
app.delete('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    await Product.destroy({ where: { Id: id } });
    res.json({ success: true });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
