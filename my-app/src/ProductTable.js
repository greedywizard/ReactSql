import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductModal from './ProductModal';
import './ProductTable.css';

const ProductTable = () => {
    //Эта строка кода использует хук useState из React для создания состояния products (просто переменная)
    // и функции setProducts для его обновления. Через метод записываем, через переменную получаем
    const [products, setProducts] = useState([])
    //аналогично
    const [selectedProduct, setSelectedProduct] = useState(null);
    //аналогично
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Запрос на получение всех объектов
    const fetchProducts = async () => {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
    };

    
    // это хук в React для управления побочными эффектами в функциональных компонентах, 
    // такими как загрузка данных, подписки и обновления DOM. 
    useEffect(() => {
        fetchProducts();
    }, []);

    
    //Собственно вызов запроса на дудаление объекта по его id
    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:5000/api/products/${id}`);
        fetchProducts();
    };

    //Методы которые привязываются к кнопкам и другим элементам
    const handleEdit = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setSelectedProduct(null);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        fetchProducts();
    };

    //Отрисовка компоенента
    return (
        <div className="container">
            {/* Устанавливаем событие на onClick сами методы чуть выше*/}
            <button className="btn btn-primary add-btn" onClick={handleAdd}>Добавить продукт</button>
            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Название</th>
                        <th>Цена</th>
                        <th>Описание</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.Id}>
                            <td>{product.Id}</td>
                            <td>{product.Title}</td>
                            <td>{product.Price}</td>
                            <td>{product.Description}</td>
                            <td>
                                <button className="btn btn-secondary" onClick={() => handleEdit(product)}>Редактировать</button>
                                <button className="btn btn-danger" onClick={() => handleDelete(product.Id)}>Удалить</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* Отображается или нет модалка. Условие если isModalOpen == true то отображается ингаче нет */}
            {isModalOpen && <ProductModal product={selectedProduct} onClose={handleModalClose} />}
        </div>
    );
};

export default ProductTable;
