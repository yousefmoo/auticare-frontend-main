import PropTypes from 'prop-types'
import { MessageSquareMore, Search } from 'lucide-react'

export default function ChatList({
  conversations,
  activeConversationId,
  onSelect,
  searchValue,
  onSearchChange,
}) {
  return (
    <aside className="flex h-full flex-col rounded-[2rem] border border-[var(--border)] bg-[var(--card)] shadow-sm">
      <div className="border-b border-[var(--border)] p-5">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-sky-100 p-3 text-sky-700">
            <MessageSquareMore className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[var(--ink)]">Messages</h2>
            <p className="text-sm text-[var(--muted)]">الأطباء والأخصائيون وأولياء الأمور</p>
          </div>
        </div>

        <label className="mt-4 flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card-alt)] px-3 py-3">
          <Search className="h-4 w-4 text-[var(--muted-2)]" />
          <input
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="ابحث في المحادثات"
            className="w-full bg-transparent text-sm text-[var(--ink)] outline-none placeholder:text-[var(--muted-2)]"
          />
        </label>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto p-3">
        {conversations.map((conversation) => {
          const isActive = conversation.id === activeConversationId

          return (
            <button
              key={conversation.id}
              type="button"
              onClick={() => onSelect(conversation.id)}
              className={`flex w-full items-start gap-3 rounded-[1.5rem] border px-3 py-3 text-left transition ${
                isActive
                  ? 'border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-900/60'
                  : 'border-transparent bg-transparent hover:border-[var(--border)] hover:bg-[var(--card-alt)]'
              }`}
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--card-alt)] text-sm font-semibold text-[var(--ink)]">
                {conversation.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate font-semibold text-[var(--ink)]">{conversation.participantName}</p>
                  <span className="text-xs text-[var(--muted-2)]">{conversation.time}</span>
                </div>
                <p className="text-xs text-[var(--muted-2)]">
                  {conversation.participantRole} - {conversation.participantSubtitle}
                </p>
                <p className="mt-1 truncate text-sm text-[var(--muted)]">{conversation.lastMessage}</p>
              </div>
              {conversation.unread > 0 && (
                <span className="rounded-full bg-sky-600 px-2 py-1 text-[11px] font-semibold text-white">
                  {conversation.unread}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </aside>
  )
}

ChatList.propTypes = {
  conversations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      participantName: PropTypes.string.isRequired,
      participantRole: PropTypes.string.isRequired,
      participantSubtitle: PropTypes.string.isRequired,
      avatar: PropTypes.string.isRequired,
      lastMessage: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
      unread: PropTypes.number.isRequired,
    })
  ).isRequired,
  activeConversationId: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  searchValue: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
}

