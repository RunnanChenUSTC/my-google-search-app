const mysql = require('mysql');
const bcrypt = require('bcryptjs');

// 使用环境变量配置数据库连接
const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

module.exports = (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send({ message: 'Method not allowed' });
  }

  const { username, password } = req.body;
  const query = 'SELECT Password FROM searchuser WHERE UserName = ?';

  pool.query(query, [username], (error, results) => {
    if (error) {
      return res.status(500).send({ message: 'Database error', error: error });
    }
    if (results.length === 0) {
      return res.status(404).send({ message: 'User not found' });
    }

    const storedPassword = results[0].Password;
    if (password === storedPassword) {
      res.status(200).send({ message: 'Login successful' });
    } else {
      res.status(401).send({ message: 'Invalid credentials' });
    }
  });
};
