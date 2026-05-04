"use client"
import { useState } from "react"

type Notif = {
  id: number
  text: string
  read: boolean
}

export default function Notification() {
  const [open, setOpen] = useState(false)
  const [notif, setNotif] = useState<Notif[]>([
    { id: 1, text: "Pengajuan surat sedang diproses", read: false },
    { id: 2, text: "Pengajuan surat disetujui", read: false },
  ])

  const unread = notif.filter(n => !n.read).length

  return (
    <div className="relative">
      {/* 🔔 BUTTON */}
      <button onClick={() => setOpen(!open)} className="relative">
        🔔
        {unread > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded p-2 z-50">
          {notif.length === 0 ? (
            <p className="text-sm text-gray-500">Tidak ada notifikasi</p>
          ) : (
            notif.map(n => (
              <div
                key={n.id}
                className={`p-2 mb-1 rounded ${
                  n.read ? "bg-gray-100" : "bg-blue-50"
                }`}
              >
                <p className="text-sm">{n.text}</p>

                {!n.read && (
                  <button
                    onClick={() =>
                      setNotif(prev =>
                        prev.map(item =>
                          item.id === n.id
                            ? { ...item, read: true }
                            : item
                        )
                      )
                    }
                    className="text-xs text-blue-500"
                  >
                    Tandai dibaca
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}