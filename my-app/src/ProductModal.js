import React, { useState } from 'react';
import axios from 'axios';
import './ProductModal.css';

const ProductModal = ({ product, onClose }) => {
    //состояния страницы для отслеживания изменения данных и олбновления DOM дерева
    //так же из этих состояни будут браться данные для зхаписи в бд
    const [title, setTitle] = useState(product ? product.Title : '');
    const [price, setPrice] = useState(product ? product.Price : '');
    const [description, setDescription] = useState(product ? product.Description : '');

    //Собственно вызов запроса на добаление или обновление
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = { Title: title, Price: price, Description: description };

        if (product) {
             //запрос на сервер на изменение записи
            await axios.put(`http://localhost:5000/api/products/${product.Id}`, data);
        } else {
             //запрос на сервер на создание записи
            await axios.post('http://localhost:5000/api/products', data);
        }
        onClose();
    };


    //верстка модалки
    return (
        <div className="modal">
            <div className="modal-content">
                <h2>{product ? 'Редактировать продукт' : 'Создать продукт'}</h2>
                <form onSubmit={handleSubmit} className="form">
                    <div className="form-group">
                        <label>Название</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Цена</label>
                        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Описание</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                    </div>
                    <div className="form-buttons">
                        <button type="submit" className="btn btn-primary">Сохранить</button>
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Отмена</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductModal;
