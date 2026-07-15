require('dotenv').config();

const express = require('express')
const app = express();
const { headlessScrape } = require('./api');

app.get('/', (req, res) => {
	return res.status(200).json({ success: true });
});

app.get('/api', async (req, res) => {
  const apiKey = req.query.key;
	if (!apiKey || apiKey !== process.env.API_KEY) return res.status(401).json({ error: 'unauthorized' });

  const data = await headlessScrape();
	return res.status(200).json({ success: true, data: data });
});

app.listen((process.env.PORT || 3000), () => console.log('✅ Server running'));