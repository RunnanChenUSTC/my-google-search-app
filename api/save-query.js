const mysql = require('mysql');

// 使用环境变量来配置数据库连接，以增强安全性
const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

module.exports = (req, res) => {
  // 确保只有POST请求被处理
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // 从请求体中获取searchQuery
  const { searchQuery } = req.body;
  if (!searchQuery) {
    res.status(400).json({ error: 'No search query provided' });
    return;
  }

  // 安全地插入查询到数据库
  const sql = 'INSERT INTO searchlog (searchterm, userID, time) VALUES (?, ?, NOW())';
  pool.query(sql, [searchQuery], (error, results) => {
    if (error) {
      console.error('Failed to save query:', error);
      res.status(500).json({ error: 'Error saving query' });
      return;
    }
    res.status(200).json({ message: 'Query saved successfully', id: results.insertId });
  });
};
