import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RequestModal from './ProductModal';
import './ProductTable.css';

const RequestTable = () => {
    const [requests, setRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchRequests = async () => {
        const response = await axios.get('http://localhost:5000/requests');
        setRequests(response.data);
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:5000/requests/${id}`);
        fetchRequests();
    };

    const handleEdit = (request) => {
        setSelectedRequest(request);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setSelectedRequest(null);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        fetchRequests();
    };

    return (
        <div className="container">
            <button className="btn btn-primary add-btn" onClick={handleAdd}>Добавить заявку</button>
            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Дата добавления</th>
                        <th>Вид авто</th>
                        <th>Модель авто</th>
                        <th>Описание проблемы</th>
                        <th>ФИО клиента</th>
                        <th>Номер телефона</th>
                        <th>Статус заявки</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map(request => (
                        <tr key={request.requestID}>
                            <td>{request.requestID}</td>
                            <td>{request.startDate}</td>
                            <td>{request.carType}</td>
                            <td>{request.carModel}</td>
                            <td>{request.problemDescryption}</td>
                            <td>{request.clientName}</td>
                            <td>{request.clientPhone}</td>
                            <td>{request.requestStatus}</td>
                            <td>
                                <button className="btn btn-secondary" onClick={() => handleEdit(request)}>Редактировать</button>
                                <button className="btn btn-danger" onClick={() => handleDelete(request.requestID)}>Удалить</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {isModalOpen && <RequestModal request={selectedRequest} onClose={handleModalClose} />}
        </div>
    );
};

export default RequestTable;