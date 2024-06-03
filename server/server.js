const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = 5000;

const db = new sqlite3.Database('data.db');

app.use(cors());
app.use(express.json());

// Получение всех заявок
app.get('/requests', (req, res) => {
    db.all(`
        SELECT r.requestID, r.startDate, r.carType, r.carModel, r.problemDescryption, r.requestStatus, r.completionDate, r.repairParts, r.masterID, r.clientID, u.fio AS clientName, u.phone AS clientPhone 
        FROM Requests r
        JOIN Users u ON r.clientID = u.userID
    `, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Добавление новой заявки
app.post('/requests', (req, res) => {
    const { startDate, carType, carModel, problemDescryption, requestStatus, completionDate, repairParts, masterID, clientID } = req.body;
    db.run(
        `INSERT INTO Requests (startDate, carType, carModel, problemDescryption, requestStatus, completionDate, repairParts, masterID, clientID) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [startDate, carType, carModel, problemDescryption, requestStatus, completionDate, repairParts, masterID, clientID],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ requestID: this.lastID });
        }
    );
});

// Обновление заявки
app.put('/requests/:id', (req, res) => {
    const requestID = req.params.id;
    const { startDate, carType, carModel, problemDescryption, requestStatus, completionDate, repairParts, masterID, clientID } = req.body;
    db.run(
        `UPDATE Requests 
         SET startDate = ?, carType = ?, carModel = ?, problemDescryption = ?, requestStatus = ?, completionDate = ?, repairParts = ?, masterID = ?, clientID = ? 
         WHERE requestID = ?`,
        [startDate, carType, carModel, problemDescryption, requestStatus, completionDate, repairParts, masterID, clientID, requestID],
        function (err) {
            if (err) {
                return res.status(500).json({ error: "Произошла ошибка при обновлении заявки" });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: "Запрос на ремонт не найден" });
            }
            res.json({ message: "Заявка обновлена" });
        }
    );
});

// Удаление заявки
app.delete('/requests/:id', (req, res) => {
    const requestID = req.params.id;
    db.run(`DELETE FROM Requests WHERE requestID = ?`, [requestID], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Заявка удалена" });
    });
});

// Добавление комментария
app.post('/comments', (req, res) => {
    const { requestID, masterID, message } = req.body;
    db.run(
        `INSERT INTO Comments (message, masterID, requestID) VALUES (?, ?, ?)`,
        [message, masterID, requestID],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ commentID: this.lastID });
        }
    );
});

// Получение всех комментариев для заявки
app.get('/requests/:id/comments', (req, res) => {
    const requestID = req.params.id;
    db.all(`SELECT * FROM Comments WHERE requestID = ?`, [requestID], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Функция для расчета среднего времени ремонта
app.get('/averageRepairTime', (req, res) => {
    db.all("SELECT startDate, completionDate FROM Requests WHERE completionDate IS NOT NULL", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        let totalRepairTime = 0;
        let requestCount = rows.length;

        rows.forEach(row => {
            let startDate = new Date(row.startDate);
            let completionDate = new Date(row.completionDate);
            totalRepairTime += (completionDate - startDate);
        });

        let averageRepairTime = totalRepairTime / requestCount;
        res.json({ averageRepairTime: formatDuration(averageRepairTime) });
    });
});

function formatDuration(ms) {
    let seconds = Math.floor(ms / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);

    seconds = seconds % 60;
    minutes = minutes % 60;
    hours = hours % 24;

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
