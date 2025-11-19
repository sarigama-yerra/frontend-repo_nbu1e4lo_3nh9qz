import TwoFAWidget from './components/TwoFAWidget'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>

      <div className="relative min-h-screen flex items-center justify-center p-8">
        <div className="max-w-3xl w-full space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Live 2FA Tool</h1>
            <p className="text-blue-200">Generate, scan, and verify TOTP codes in real time.</p>
          </div>

          <TwoFAWidget />

          <div className="text-center">
            <p className="text-sm text-blue-300/60">Use any authenticator app to scan the QR and verify the code.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
