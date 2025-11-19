import { useEffect, useMemo, useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function TwoFAWidget() {
  const [userId, setUserId] = useState('demo-user')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null)
  const [qrUrl, setQrUrl] = useState('')
  const [otp, setOtp] = useState('')
  const [setupInfo, setSetupInfo] = useState(null)
  const [message, setMessage] = useState('')

  const fetchStatus = async (uid = userId) => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/2fa/status?user_id=${encodeURIComponent(uid)}`)
      const data = await res.json()
      setStatus(data)
    } catch (e) {
      setMessage(`Failed to get status: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStatus()
  }, [])

  const handleSetup = async () => {
    setLoading(true)
    setMessage('')
    try {
      const res = await fetch(`${API_BASE}/2fa/setup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, issuer: 'Flames 2FA', label: userId })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Setup failed')
      setSetupInfo(data)
      setQrUrl(data.qr_data_url)
      await fetchStatus(userId)
    } catch (e) {
      setMessage(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async () => {
    setLoading(true)
    setMessage('')
    try {
      const res = await fetch(`${API_BASE}/2fa/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, code: otp })
      })
      const data = await res.json()
      if (!data.success) {
        setMessage('Invalid code. Try again.')
      } else {
        setMessage('2FA enabled!')
      }
      await fetchStatus(userId)
    } catch (e) {
      setMessage(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDisable = async () => {
    setLoading(true)
    setMessage('')
    try {
      const res = await fetch(`${API_BASE}/2fa/disable`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId })
      })
      await res.json()
      await fetchStatus(userId)
      setMessage('2FA disabled for this user')
    } catch (e) {
      setMessage(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto bg-slate-800/50 border border-blue-500/20 rounded-2xl p-6 text-white">
      <h2 className="text-2xl font-semibold mb-4">Two-Factor Authentication</h2>

      <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-2 items-end">
        <div className="sm:col-span-2">
          <label className="block text-sm text-blue-200 mb-1">User ID</label>
          <input
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full px-3 py-2 rounded bg-slate-900/60 border border-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="enter a unique user id"
          />
        </div>
        <button onClick={() => fetchStatus()} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 transition">Refresh</button>
      </div>

      {status && (
        <div className="mb-4 text-blue-100">
          <p>Status: {status.enabled ? 'Enabled' : 'Not enabled'}</p>
          <p>Configured: {status.configured ? 'Yes' : 'No'}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={handleSetup} disabled={loading} className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50">Generate QR</button>
        <button onClick={handleDisable} disabled={loading} className="px-4 py-2 rounded bg-red-600 hover:bg-red-500 disabled:opacity-50">Disable</button>
      </div>

      {qrUrl && (
        <div className="mb-4">
          <p className="text-blue-200 mb-2">Scan this QR with Google Authenticator, 1Password, etc.</p>
          <img src={qrUrl} alt="2FA QR" className="w-56 h-56 bg-white p-2 rounded" />
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm text-blue-200 mb-1">Enter 6-digit code</label>
        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full px-3 py-2 rounded bg-slate-900/60 border border-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-500 tracking-widest"
          placeholder="123456"
        />
        <button onClick={handleVerify} disabled={loading} className="mt-2 px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50">Verify & Enable</button>
      </div>

      {message && <div className="text-sm text-blue-200">{message}</div>}
    </div>
  )
}
