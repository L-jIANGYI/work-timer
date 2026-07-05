import { useState } from 'react';

export default function Auth({ onSignIn, onSignUp }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('login');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError('');
    setMessage('');
    setLoading(true);
    if (mode === 'login') {
      const err = await onSignIn(email, password);
      if (err) setError(err.message);
    } else {
      const err = await onSignUp(email, password);
      if (err) setError(err.message);
      else setMessage('Controleer je e-mail om je account te bevestigen.');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-200 p-8 w-full max-w-sm">
        <h1 className="text-xl font-medium text-gray-800 mb-6">Urenregistratie</h1>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 text-sm py-2 rounded-lg transition-colors ${
              mode === 'login' ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Inloggen
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 text-sm py-2 rounded-lg transition-colors ${
              mode === 'register' ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Registreren
          </button>
        </div>

        <div className="flex flex-col gap-3 mb-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mailadres"
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Wachtwoord"
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
        </div>

        {error && <p className="text-xs text-red-400 mb-3">{error}</p>}
        {message && <p className="text-xs text-green-500 mb-3">{message}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading || !email || !password}
          className="w-full bg-blue-600 text-white rounded-lg py-2 text-sm hover:bg-blue-700 disabled:opacity-40 transition-colors"
        >
          {loading ? 'Even wachten...' : mode === 'login' ? 'Inloggen' : 'Account aanmaken'}
        </button>
      </div>
    </div>
  );
}
