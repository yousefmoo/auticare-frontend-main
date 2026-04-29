import { useEffect, useRef } from 'react'
import { AlertTriangle, CheckCircle, Info, X } from 'lucide-react'
import { useUIStore } from '../../store/uiStore'

const toastStyles = {
  success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
}

const toastIcons = {
  success: CheckCircle,
  error: AlertTriangle,
  warning: AlertTriangle,
  info: Info,
}

export default function ToastContainer() {
  const { toasts, removeToast } = useUIStore()
  const timers = useRef(new Map())

  useEffect(() => {
    toasts.forEach((toast) => {
      if (!timers.current.has(toast.id)) {
        const timer = setTimeout(() => {
          removeToast(toast.id)
          timers.current.delete(toast.id)
        }, toast.duration || 3000)
        timers.current.set(toast.id, timer)
      }
    })

    timers.current.forEach((timer, id) => {
      if (!toasts.find((toast) => toast.id === id)) {
        clearTimeout(timer)
        timers.current.delete(id)
      }
    })
  }, [toasts, removeToast])

  useEffect(() => {
    const timersMap = timers.current
    return () => {
      timersMap.forEach((timer) => clearTimeout(timer))
      timersMap.clear()
    }
  }, [])

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-20 right-4 z-50 space-y-3">
      {toasts.map((toast) => {
        const Icon = toastIcons[toast.type] || Info
        return (
          <div
            key={toast.id}
            className={`flex items-start gap-3 w-80 border rounded-xl p-4 shadow-lg animate-fade-in ${
              toastStyles[toast.type] || toastStyles.info
            }`}
          >
            <Icon className="h-5 w-5 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold">{toast.title || 'Notice'}</p>
              <p className="text-xs mt-1 text-gray-700">{toast.message}</p>
            </div>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => removeToast(toast.id)}
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
