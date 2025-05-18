// pages/api/google-search.js

export default async function handler(req, res) {
    if (req.method === 'POST') {
      const { searchKey, start, num } = req.body;  // 获取前端传递的搜索关键词、起始位置和结果数量
      const googleSearchKey = 'AIzaSyBT6bUL1Fxp9eGhivDqMSjPcDLVnC5ZLlI';
      const googleCxId = '133bf954924984aee';
      const baseurl = 'https://customsearch.googleapis.com/customsearch/v1';
  
      try {
        // 构建 Google Custom Search API 的请求 URL
        const searchUrl = `${baseurl}?q=${encodeURIComponent(searchKey)}&cx=${googleCxId}&key=${googleSearchKey}&start=${start}&num=${num}`;
  
        // 发起 GET 请求到 Google 搜索 API
        const response = await fetch(searchUrl);
  
        if (!response.ok) {
          throw new Error('Failed to fetch search results');
        }
  
        const data = await response.json();
        res.status(200).json(data);  // 返回搜索结果
      } catch (error) {
        console.error('Error fetching search results from Google:', error);
        res.status(500).json({ error: 'Failed to fetch search results' });
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' });  // 如果不是 POST 请求，返回 405 错误
    }
  }
  