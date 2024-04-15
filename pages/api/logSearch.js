// pages/api/logSearch.js
import mysql from 'mysql2/promise';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { searchTerm } = req.body;
        const connectionConfig = {
            host: 'mysqlserverless.cluster-cautknyafblq.us-east-1.rds.amazonaws.com',
            user: 'admin',
            password: '35nPQH!ut;anvcA',
            database: 'GPT_experiment',
        };

        try {
            const connection = await mysql.createConnection(connectionConfig);
            const [results] = await connection.execute(
                `INSERT INTO searchlog (searchterm, time) VALUES (?, NOW())`,
                [searchTerm]
            );
            connection.end();

            res.status(200).json({ success: true, message: 'Search term logged successfully' });
        } catch (error) {
            console.error('Failed to log search term:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
