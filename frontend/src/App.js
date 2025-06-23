import React, { useState } from 'react';

function App() {
  const [urls, setUrls] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    const urlList = urls
      .split('\n')
      .map((u) => u.trim())
      .filter((u) => u.length > 0);
    if (urlList.length === 0) {
      setError('Lütfen en az bir URL girin.');
      setLoading(false);
      return;
    }
    try {
      const response = await fetch('/api/index', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls: urlList }),
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', padding: 24, border: '1px solid #eee', borderRadius: 8, background: '#fafbfc' }}>
      <h2>URL Gönderici</h2>
      <form onSubmit={handleSubmit}>
        <label>
          URL'leri girin (her satıra bir tane):
          <textarea
            rows={8}
            style={{ width: '100%', marginTop: 8 }}
            value={urls}
            onChange={(e) => setUrls(e.target.value)}
            placeholder="https://ornek.com/1\nhttps://ornek.com/2"
          />
        </label>
        <button type="submit" style={{ marginTop: 16, width: '100%' }} disabled={loading}>
          {loading ? 'Gönderiliyor...' : 'URL Gönder'}
        </button>
      </form>
      {error && <div style={{ color: 'red', marginTop: 16 }}>{error}</div>}
      {result && (
        <div style={{ marginTop: 16 }}>
          <b>Sonuç:</b>
          <pre style={{ background: '#eee', padding: 8, borderRadius: 4 }}>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App; 