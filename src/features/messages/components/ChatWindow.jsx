import { useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Paperclip, PhoneCall, Send, Video } from 'lucide-react'
import MessageBubble from './MessageBubble'

function TypingDots() {
  return (
    <div className="flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-3 shadow-sm">
      <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--muted-2)]" />
      <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--muted-2)] [animation-delay:150ms]" />
      <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--muted-2)] [animation-delay:300ms]" />
    </div>
  )
}

export default function ChatWindow({ role, conversation, messages, onSendMessage, isLoading, isError, isSending }) {
  const [draft, setDraft] = useState('')
  const messageContainerRef = useRef(null)

  const liveMeetingPath = useMemo(() => `/${role}/sessions`, [role])

  useEffect(() => {
    const container = messageContainerRef.current
    if (!container) return
    container.scrollTop = container.scrollHeight
  }, [messages, conversation?.typing])

  if (!conversation) {
    return (
      <div className="flex h-full items-center justify-center rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-8 text-center text-[var(--muted)] shadow-sm">
        اختر محادثة للبدء.
      </div>
    )
  }

  const handleSend = () => {
    if (!draft.trim() || isSending) return
    onSendMessage(draft.trim())
    setDraft('')
  }

  return (
    <section className="flex h-full flex-col overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--card)] shadow-sm">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-sm font-semibold text-sky-700">
            {conversation.avatar}
          </div>
          <div>
            <h2 className="font-semibold text-[var(--ink)]">{conversation.participantName}</h2>
            <p className="text-sm text-[var(--muted)]">
              {conversation.participantRole} - {conversation.participantSubtitle}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--ink)] transition hover:bg-[var(--card-alt)]"
          >
            <PhoneCall className="h-4 w-4" />
            Call
          </button>
          <Link
            to={liveMeetingPath}
            className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-500"
          >
            <Video className="h-4 w-4" />
            Session links
          </Link>
        </div>
      </header>

      <div ref={messageContainerRef} className="flex-1 space-y-4 overflow-y-auto bg-[var(--card-alt)] px-5 py-5">
        {isLoading && (
          <p className="text-sm text-[var(--muted)]">Loading messages...</p>
        )}
        {isError && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            Could not load messages. Please try again.
          </p>
        )}
        {!isLoading && !isError && messages.map((message) => (
          <MessageBubble key={message.id} message={message} isOwn={message.sender === role} />
        ))}
        {conversation.typing && (
          <div className="flex justify-start">
            <TypingDots />
          </div>
        )}
      </div>

      <footer className="border-t border-[var(--border)] px-5 py-4">
        <div className="flex items-end gap-3">
          <button
            type="button"
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[var(--border)] text-[var(--muted)] transition hover:bg-[var(--card-alt)]"
            aria-label="Attach file"
          >
            <Paperclip className="h-5 w-5" />
          </button>
          <div className="flex-1 rounded-[1.5rem] border border-[var(--border)] bg-[var(--card-alt)] px-4 py-3">
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              rows={2}
              placeholder="اكتب رسالتك"
              className="w-full resize-none bg-transparent text-sm text-[var(--ink)] outline-none placeholder:text-[var(--muted-2)]"
            />
          </div>
          <button
            type="button"
            onClick={handleSend}
            disabled={isSending}
            className="inline-flex h-12 items-center gap-2 rounded-2xl bg-sky-600 px-5 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send className="h-4 w-4" />
            {isSending ? 'Sending...' : 'Send'}
          </button>
        </div>
      </footer>
    </section>
  )
}

ChatWindow.propTypes = {
  role: PropTypes.string.isRequired,
  conversation: PropTypes.shape({
    avatar: PropTypes.string.isRequired,
    participantName: PropTypes.string.isRequired,
    participantRole: PropTypes.string.isRequired,
    participantSubtitle: PropTypes.string.isRequired,
    typing: PropTypes.bool,
  }),
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      sender: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
    })
  ).isRequired,
  onSendMessage: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  isError: PropTypes.bool,
  isSending: PropTypes.bool,
}

