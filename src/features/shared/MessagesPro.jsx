import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageSquare, Search, Send, UserPlus, Video, X } from 'lucide-react'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { useAuthStore } from '../../store'
import {
  getDemoScreeningResult,
  getStoredScreeningResult,
} from '../screening/screeningInsights'

const mockConversations = [
  {
    id: 'c1',
    name: 'Dr. Ahmed Ali',
    role: 'Doctor',
    specialty: 'Child Neurologist',
    lastMessage: 'Thanks, I reviewed the screening summary.',
    time: '2h',
    unread: 1,
    messages: [
      { id: 'm1', fromMe: false, text: 'Hi, can we review the latest screening result?' },
      { id: 'm2', fromMe: true, text: 'Sure, I shared the summary from the dashboard.' },
    ],
  },
  {
    id: 'c2',
    name: 'Ther. Amany Ebrahim',
    role: 'Therapist',
    specialty: 'Behavior Therapist',
    lastMessage: 'Let’s focus on short home routines this week.',
    time: '1d',
    unread: 0,
    messages: [
      { id: 'm3', fromMe: false, text: 'Please share the best home activities for this week.' },
      { id: 'm4', fromMe: true, text: 'I can do that. I will also send the questionnaire results.' },
    ],
  },
]

const getInitials = (name) =>
  name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

export default function MessagesPro() {
  const { role } = useAuthStore()
  const [conversations, setConversations] = useState(mockConversations)
  const [activeId, setActiveId] = useState(mockConversations[0]?.id)
  const [text, setText] = useState('')
  const [query, setQuery] = useState('')
  const [showRecipientPicker, setShowRecipientPicker] = useState(false)
  const [recipientQuery, setRecipientQuery] = useState('')

  const recipients = useMemo(() => {
    const specialistList = (getStoredScreeningResult() || getDemoScreeningResult()).specialists
    if (role !== 'parent') return specialistList
    return specialistList.filter((item) => item.channel === 'Doctor' || item.channel === 'Therapist')
  }, [role])

  const active = conversations.find((conversation) => conversation.id === activeId) || conversations[0]

  const filteredConversations = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return conversations

    return conversations.filter(
      (conversation) =>
        conversation.name.toLowerCase().includes(q) ||
        conversation.lastMessage.toLowerCase().includes(q) ||
        conversation.specialty.toLowerCase().includes(q)
    )
  }, [conversations, query])

  const filteredRecipients = useMemo(() => {
    const q = recipientQuery.trim().toLowerCase()
    if (!q) return recipients

    return recipients.filter(
      (recipient) =>
        recipient.name.toLowerCase().includes(q) ||
        recipient.specialty.toLowerCase().includes(q) ||
        recipient.channel.toLowerCase().includes(q)
    )
  }, [recipientQuery, recipients])

  const handleSend = () => {
    if (!text.trim() || !active) return

    const newMessage = {
      id: `m${Date.now()}`,
      fromMe: true,
      text: text.trim(),
    }

    setConversations((currentConversations) =>
      currentConversations.map((conversation) =>
        conversation.id !== active.id
          ? conversation
          : {
              ...conversation,
              messages: [...conversation.messages, newMessage],
              lastMessage: newMessage.text,
              time: 'now',
              unread: 0,
            }
      )
    )

    setText('')
  }

  const handleCreateConversation = (recipient) => {
    const existingConversation = conversations.find((conversation) => conversation.name === recipient.name)

    if (existingConversation) {
      setActiveId(existingConversation.id)
      setShowRecipientPicker(false)
      setRecipientQuery('')
      return
    }

    const newConversation = {
      id: `c${Date.now()}`,
      name: recipient.name,
      role: recipient.channel,
      specialty: recipient.specialty,
      lastMessage: `New conversation with ${recipient.name}`,
      time: 'now',
      unread: 0,
      messages: [
        {
          id: `m${Date.now()}-intro`,
          fromMe: false,
          text:
            role === 'parent'
              ? 'Hello, I’m available to review the screening summary and next steps.'
              : 'Hello, I’m ready to collaborate on this child’s care plan.',
        },
      ],
    }

    setConversations((currentConversations) => [newConversation, ...currentConversations])
    setActiveId(newConversation.id)
    setShowRecipientPicker(false)
    setRecipientQuery('')
  }

  return (
    <div className="bg-white rounded-[1.5rem] shadow-sm overflow-hidden h-[72vh] border border-[var(--border)]">
      <div className="grid grid-cols-12 h-full">
        <div className="col-span-12 lg:col-span-4 border-r border-[var(--border)]">
          <div className="p-4 border-b border-[var(--border)]">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-gray-600" />
                <div>
                  <h3 className="text-lg font-semibold text-[var(--ink)]">Messages</h3>
                  <p className="text-xs text-[var(--muted-2)]">Talk to doctors and therapists</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowRecipientPicker(true)}>
                <UserPlus className="w-4 h-4 mr-2" />
                New
              </Button>
            </div>

            <div className="mt-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-md bg-gray-100">
                  <Search className="w-4 h-4 text-gray-500" />
                </div>
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search conversations"
                  className="!p-2"
                  aria-label="Search conversations"
                />
              </div>
            </div>
          </div>

          <div className="p-3 space-y-2 overflow-y-auto h-[calc(72vh-128px)]">
            {filteredConversations.length === 0 && (
              <div className="text-sm text-gray-500 p-3">No conversations found</div>
            )}
            {filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                type="button"
                onClick={() => setActiveId(conversation.id)}
                className={`w-full text-left flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors ${
                  conversation.id === activeId ? 'bg-primary-50' : ''
                }`}
              >
                <div className="rounded-full bg-gray-200 w-12 h-12 flex items-center justify-center text-sm font-medium text-gray-700">
                  {getInitials(conversation.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center gap-3">
                    <div className="font-medium text-sm text-[var(--ink)] truncate">{conversation.name}</div>
                    <div className="text-xs text-gray-400 shrink-0">{conversation.time}</div>
                  </div>
                  <div className="text-xs text-[var(--muted-2)]">{conversation.role} • {conversation.specialty}</div>
                  <div className="text-sm text-gray-500 truncate">{conversation.lastMessage}</div>
                </div>
                {conversation.unread > 0 && (
                  <div className="ml-2 bg-danger-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {conversation.unread}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8 flex flex-col">
          {!active ? (
            <div className="h-full flex items-center justify-center text-gray-500">
              No conversations yet. Select one or start a new chat.
            </div>
          ) : (
            <>
              <div className="p-4 border-b border-[var(--border)] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="rounded-full bg-gray-200 w-12 h-12 flex items-center justify-center text-sm font-medium text-gray-700">
                    {getInitials(active.name)}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-[var(--ink)] truncate">{active.name}</div>
                    <div className="text-xs text-gray-500">
                      {active.role} • {active.specialty}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-xs text-gray-500">{active.messages.length} messages</div>
                  <Link
                    to={`/${role}/sessions/live`}
                    className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-2 text-xs font-semibold text-primary-700"
                  >
                    <Video className="h-4 w-4" />
                    Video Call
                  </Link>
                  <Button variant="ghost" size="sm">
                    Details
                  </Button>
                </div>
              </div>

              <div className="p-4 flex-1 overflow-y-auto space-y-3 bg-[var(--card-alt)]">
                {active.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`max-w-[78%] ${message.fromMe ? 'ml-auto text-right' : ''}`}
                  >
                    <div
                      className={`inline-block px-4 py-3 rounded-2xl ${
                        message.fromMe ? 'bg-primary-500 text-white' : 'bg-white text-gray-800 border border-[var(--border)]'
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-[var(--border)]">
                <div className="flex gap-3 items-center">
                  <Input
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    placeholder="Type a message..."
                    className="flex-1"
                    aria-label="Type a message"
                  />
                  <Button onClick={handleSend} variant="primary" size="md">
                    <Send className="w-4 h-4 mr-2" />
                    Send
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {showRecipientPicker && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 p-4 flex items-center justify-center">
          <div className="w-full max-w-2xl rounded-[1.75rem] bg-white border border-[var(--border)] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
              <div>
                <h3 className="text-xl font-bold text-[var(--ink)]">Start a new conversation</h3>
                <p className="text-sm text-[var(--muted)] mt-1">
                  Choose a doctor or therapist from the recommendation list.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowRecipientPicker(false)}
                className="rounded-full p-2 hover:bg-[var(--card-alt)] transition-colors"
                aria-label="Close recipient picker"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5 border-b border-[var(--border)]">
              <Input
                value={recipientQuery}
                onChange={(event) => setRecipientQuery(event.target.value)}
                placeholder="Search doctors or therapists"
                aria-label="Search doctors or therapists"
              />
            </div>

            <div className="max-h-[420px] overflow-y-auto p-5 space-y-3">
              {filteredRecipients.length === 0 && (
                <div className="rounded-2xl bg-[var(--card-alt)] p-4 text-sm text-[var(--muted)]">
                  No doctors or therapists match your search.
                </div>
              )}

              {filteredRecipients.map((recipient) => (
                <button
                  key={recipient.id}
                  type="button"
                  onClick={() => handleCreateConversation(recipient)}
                  className="w-full rounded-2xl border border-[var(--border)] p-4 text-left hover:border-emerald-300 hover:bg-emerald-50/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-[var(--ink)]">{recipient.name}</p>
                      <p className="text-sm text-[var(--muted)] mt-1">
                        {recipient.channel} • {recipient.specialty}
                      </p>
                      <p className="text-xs text-[var(--muted-2)] mt-2">
                        {recipient.recommendedFor} • {recipient.availability}
                      </p>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      {Math.round(recipient.rating * 20)}% fit
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
