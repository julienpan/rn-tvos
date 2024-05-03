const express = require('express');
const bodyParser = require('body-parser');
const iptvParser = require('iptv-playlist-parser');
const https = require('https');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Route POST pour recevoir le lien M3U et renvoyer les URL des flux vidéo
app.post('/api/iptv', (req, res) => {
    try {
        const m3uLink = req.body.m3uLink;

        https.get(m3uLink, response => {
            let data = '';

            response.on('data', chunk => {
                data += chunk;
            });

            response.on('end', () => {
                const playlist = iptvParser.parse(data);
                const videoURLs = playlist.items.map(item => item.url);

                res.json({ videoURLs });
            });
        })
        .on('error', err => {
            console.error(err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        });
    } catch (error) {
        console.error('Error parsing M3U link:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
