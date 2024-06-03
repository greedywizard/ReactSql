import React, { useState } from 'react';
import axios from 'axios';
import './ProductModal.css';

const RequestModal = ({ request, onClose }) => {
    const [startDate, setStartDate] = useState(request ? request.startDate : '');
    const [carType, setCarType] = useState(request ? request.carType : '');
    const [carModel, setCarModel] = useState(request ? request.carModel : '');
    const [problemDescryption, setProblemDescryption] = useState(request ? request.problemDescryption : '');
    const [clientName, setClientName] = useState(request ? request.clientName : '');
    const [clientPhone, setClientPhone] = useState(request ? request.clientPhone : '');
    const [requestStatus, setRequestStatus] = useState(request ? request.requestStatus : '');
    const [masterID, setMasterID] = useState(request ? request.masterID : '');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = { 
            startDate, 
            carType, 
            carModel, 
            problemDescryption, 
            clientName, 
            clientPhone, 
            requestStatus, 
            masterID 
        };

        if (request) {
            await axios.put(`http://localhost:5000/requests/${request.requestID}`, data);
        } else {
            await axios.post('http://localhost:5000/requests', data);
        }
        onClose();
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>{request ? 'Редактировать заявку' : 'Создать заявку'}</h2>
                <form onSubmit={handleSubmit} className="form">
                    <div className="form-group">
                        <label>Дата добавления</label>
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Вид авто</label>
                        <input type="text" value={carType} onChange={(e) => setCarType(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Модель авто</label>
                        <input type="text" value={carModel} onChange={(e) => setCarModel(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Описание проблемы</label>
                        <textarea value={problemDescryption} onChange={(e) => setProblemDescryption(e.target.value)} required></textarea>
                    </div>
                    <div className="form-group">
                        <label>ФИО клиента</label>
                        <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Номер телефона</label>
                        <input type="tel" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Статус заявки</label>
                        <select value={requestStatus} onChange={(e) => setRequestStatus(e.target.value)} required>
                            <option value="new">Новая заявка</option>
                            <option value="in_progress">В процессе ремонта</option>
                            <option value="completed">Завершена</option>
                            <option value="ready_for_delivery">Готова к выдаче</option>
                            <option value="awaiting_parts">Ожидание автозапчастей</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>ID ответственного мастера</label>
                        <input type="number" value={masterID} onChange={(e) => setMasterID(e.target.value)} required />
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

export default RequestModal;
