// /admin-web/src/App.jsx
import React, { useEffect, useState } from 'react';

const ADMIN_USER = 'admin'; // 本来は環境変数か安全な方法で管理
const ADMIN_PASS = 'password';

function App() {
  const [servers, setServers] = useState([]);
  const [error, setError] = useState('');

  const fetchServers = () => {
    fetch('http://localhost:3001/servers', {
      headers: {
        'Authorization': 'Basic ' + btoa(`${ADMIN_USER}:${ADMIN_PASS}`),
      }
    })
    .then(res => {
      if (!res.ok) throw new Error('認証エラーまたは通信失敗');
      return res.json();
    })
    .then(data => setServers(data))
    .catch(err => setError(err.message));
  };

  useEffect(() => {
    fetchServers();
  }, []);

  const controlServer = (name, action) => {
    fetch(`http://localhost:3001/servers/${name}/${action}`, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${ADMIN_USER}:${ADMIN_PASS}`),
      }
    })
    .then(res => {
      if (!res.ok) throw new Error('操作失敗');
      return res.json();
    })
    .then(() => fetchServers())
    .catch(err => setError(err.message));
  };

  return (
    <div>
      <h1>サーバー管理画面</h1>
      {error && <p style={{color:'red'}}>{error}</p>}
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>サーバー名</th>
            <th>状態</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {servers.map(s => (
            <tr key={s.name}>
              <td>{s.name}</td>
              <td>{s.status}</td>
              <td>
                <button onClick={() => controlServer(s.name, 'start')}>起動</button>
                <button onClick={() => controlServer(s.name, 'stop')}>停止</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
