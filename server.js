const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// 解析 JSON 请求体
app.use(bodyParser.json());

// Database connection
const connection = mysql.createConnection({
  host: 'mysqlserverless.cluster-cautknyafblq.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: '35nPQH!ut;anvcA',
  database: 'GPT_experiment'
});

connection.connect(error => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
});

// 接收搜索词并存储到数据库
app.post('/api/search', (req, res) => {
  const { searchTerm } = req.body;
  const sql = `INSERT INTO searchlog (searchterm, time) VALUES (?, NOW())`;
  connection.query(sql, [searchTerm], (error, results) => {
    if (error) {
      return res.status(500).send('Error saving the search term');
    }
    res.send({ id: results.insertId, searchTerm, message: 'Search term saved successfully!' });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
