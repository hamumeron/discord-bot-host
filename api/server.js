// /api/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// 簡易認証用ユーザー名・パスワード（本来はDB等で管理）
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'password';

// 仮想サーバー状態保持（Botと同期したい場合はDBなどに切り替え）
const servers = new Map();

function basicAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).send('認証が必要です');

  const [scheme, credentials] = auth.split(' ');
  if (scheme !== 'Basic') return res.status(400).send('Bad Authorization header');

  const [user, pass] = Buffer.from(credentials, 'base64').toString().split(':');
  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    next();
  } else {
    res.status(403).send('認証失敗');
  }
}

app.use(basicAuth);

app.get('/servers', (req, res) => {
  const list = Array.from(servers.entries()).map(([name, status]) => ({ name, status }));
  res.json(list);
});

app.post('/servers/:name/start', (req, res) => {
  const name = req.params.name;
  servers.set(name, 'running');
  res.json({ message: `${name}を起動しました。` });
});

app.post('/servers/:name/stop', (req, res) => {
  const name = req.params.name;
  servers.set(name, 'stopped');
  res.json({ message: `${name}を停止しました。` });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API Server running on port ${PORT}`);
});
