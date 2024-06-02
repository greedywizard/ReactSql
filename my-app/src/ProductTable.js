import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductModal from './ProductModal';
import './ProductTable.css';

const ProductTable = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchProducts = async () => {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:5000/api/products/${id}`);
        fetchProducts();
    };

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

    return (
        <div className="container">
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
            {isModalOpen && <ProductModal product={selectedProduct} onClose={handleModalClose} />}
        </div>
    );
};

export default ProductTable;
