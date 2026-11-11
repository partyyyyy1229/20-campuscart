import { useState } from 'react'
import {
  QrCode,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  ArrowRight,
  Smartphone,
  Sparkles,
} from 'lucide-react'

interface UpiPaymentModalProps {
  amount: number
  canteenName: string
  roommateSplits: { name: string; shareAmount: number }[]
  onPaymentSuccess: () => void
}

export function UpiPaymentModal({
  amount,
  canteenName,
  roommateSplits,
  onPaymentSuccess,
}: UpiPaymentModalProps) {
  const [selectedApp, setSelectedApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'cred'>('gpay')
  const [copiedUpi, setCopiedUpi] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const upiId = 'campuscart.tiet@okhdfcbank'
  const upiPayload = `upi://pay?pa=${upiId}&pn=CampusCart%20TIET&am=${amount}&cu=INR&tn=Midnight%20Canteen%20Order`

  const handleCopyUpi = () => {
    navigator.clipboard?.writeText(upiId)
    setCopiedUpi(true)
    setTimeout(() => setCopiedUpi(false), 2000)
  }

  const handleSimulatePayment = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      onPaymentSuccess()
    }, 1000)
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <QrCode className="w-4 h-4 text-amber-500" />
            Dynamic UPI Instant Settlement Terminal
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Zero gateway fee UPI protocol. Scan with any banking or UPI app to authorize order token.
          </p>
        </div>

        <div className="font-mono text-xs">
          <span className="text-slate-400 block text-[10px] uppercase">Amount Payable</span>
          <span className="font-bold text-slate-900 dark:text-white text-lg">
            ₹{amount.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Dynamic QR Render */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
          <div className="p-4 rounded-2xl border-2 border-dashed border-amber-500/40 bg-slate-50 dark:bg-slate-800/40 relative group">
            {/* SVG Visual QR Simulation */}
            <svg
              viewBox="0 0 160 160"
              className="w-48 h-48 mx-auto fill-slate-900 dark:fill-white"
            >
              {/* Position Detection Squares */}
              <rect x="10" y="10" width="40" height="40" rx="4" fill="none" stroke="currentColor" strokeWidth="6" />
              <rect x="22" y="22" width="16" height="16" />

              <rect x="110" y="10" width="40" height="40" rx="4" fill="none" stroke="currentColor" strokeWidth="6" />
              <rect x="122" y="22" width="16" height="16" />

              <rect x="10" y="110" width="40" height="40" rx="4" fill="none" stroke="currentColor" strokeWidth="6" />
              <rect x="22" y="122" width="16" height="16" />

              {/* Data matrix dots */}
              <rect x="60" y="20" width="8" height="8" />
              <rect x="75" y="15" width="8" height="8" />
              <rect x="90" y="25" width="8" height="8" />
              <rect x="65" y="45" width="12" height="12" />
              <rect x="85" y="55" width="10" height="10" />
              <rect x="20" y="65" width="10" height="10" />
              <rect x="40" y="80" width="14" height="8" />
              <rect x="60" y="75" width="10" height="10" />
              <rect x="75" y="90" width="12" height="12" />
              <rect x="95" y="80" width="8" height="14" />
              <rect x="115" y="65" width="14" height="10" />
              <rect x="135" y="80" width="10" height="10" />
              <rect x="60" y="115" width="12" height="8" />
              <rect x="80" y="125" width="10" height="12" />
              <rect x="100" y="115" width="8" height="10" />
              <rect x="120" y="125" width="14" height="12" />
            </svg>
          </div>

          <div className="space-y-1">
            <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
              UPI ID: {upiId}
            </span>
            <button
              onClick={handleCopyUpi}
              className="text-xs text-amber-600 dark:text-amber-400 hover:underline flex items-center justify-center gap-1 mx-auto"
            >
              {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedUpi ? 'Copied to Clipboard' : 'Copy UPI ID'}</span>
            </button>
          </div>
        </div>

        {/* Right: Payment Apps & Confirm CTA */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2">
              Select Your Preferred UPI App
            </h4>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { id: 'gpay', name: 'Google Pay' },
                { id: 'phonepe', name: 'PhonePe' },
                { id: 'paytm', name: 'Paytm UPI' },
                { id: 'cred', name: 'CRED UPI' },
              ].map((app) => (
                <button
                  key={app.id}
                  onClick={() => setSelectedApp(app.id as any)}
                  className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                    selectedApp === app.id
                      ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {app.name}
                </button>
              ))}
            </div>

            {/* Roommate splits reminder */}
            {roommateSplits.length > 1 && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1 text-xs">
                <span className="font-semibold text-slate-900 dark:text-white block">
                  Roommate Share Checklist:
                </span>
                <div className="space-y-1 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                  {roommateSplits.map((s) => (
                    <div key={s.name} className="flex justify-between">
                      <span>{s.name}:</span>
                      <span className="font-bold">₹{s.shareAmount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleSimulatePayment}
            disabled={isProcessing || amount <= 0}
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Verifying UPI UTR & Dispatched to Canteen...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Simulate UPI Payment Success & Generate Token</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
