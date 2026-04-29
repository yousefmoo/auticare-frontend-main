import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { PageHeader } from '../../../components/shared/PageFrame'
import { useAuthStore } from '../../../store'
import usePageTitle from '../../../utils/usePageTitle'
import { getConversations, getMessages, sendMessage } from '../../../api/messages.api'
import ChatList from '../components/ChatList'
import ChatWindow from '../components/ChatWindow'
import { DashboardEmpty, DashboardSkeleton } from '../../../components/shared/DashboardState'

export default function MessagesPage() {
  const role = useAuthStore((state) => state.role)
  const [activeConversationId, setActiveConversationId] = useState(null)
  const [search, setSearch] = useState('')
  const queryClient = useQueryClient()

  usePageTitle('Messages')

  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ['messages', role],
    queryFn: () => getConversations(role),
  })

  useEffect(() => {
    if (!activeConversationId && conversations[0]?.id) {
      setActiveConversationId(conversations[0].id)
    }
  }, [activeConversationId, conversations])

  const filteredConversations = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return conversations

    return conversations.filter((conversation) =>
      [conversation.participantName, conversation.participantRole, conversation.lastMessage]
        .join(' ')
        .toLowerCase()
        .includes(query)
    )
  }, [conversations, search])

  const activeConversation =
    filteredConversations.find((item) => item.id === activeConversationId) ||
    conversations.find((item) => item.id === activeConversationId) ||
    null

  const { data: activeMessages = [] } = useQuery({
    queryKey: ['messages', 'thread', activeConversation?.id],
    queryFn: () => getMessages(activeConversation.id),
    enabled: Boolean(activeConversation?.id),
  })

  const sendMessageMutation = useMutation({
    mutationFn: (text) => sendMessage(activeConversation.id, { sender: role, text, time: 'الآن' }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['messages', role] }),
        queryClient.invalidateQueries({ queryKey: ['messages', 'thread', activeConversation.id] }),
      ])
    },
  })

  const handleSendMessage = async (text) => {
    if (!activeConversation) return
    await sendMessageMutation.mutateAsync(text)
  }

  return (
    <div className="fade-in space-y-6">
      <PageHeader
        title="Messages"
        subtitle="نسق مع الطبيب والأخصائي والأسرة من واجهة محادثات واضحة وسريعة."
      />

      <div className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
        <div className="min-h-[72vh]">
          {isLoading ? (
            <DashboardSkeleton cards={2} className="md:grid-cols-1 xl:grid-cols-1" />
          ) : filteredConversations.length === 0 ? (
            <DashboardEmpty title="لا توجد محادثات" description="ستظهر هنا محادثات الطبيب والأخصائي وولي الأمر." />
          ) : (
            <ChatList
              conversations={filteredConversations}
              activeConversationId={activeConversationId}
              onSelect={setActiveConversationId}
              searchValue={search}
              onSearchChange={setSearch}
            />
          )}
        </div>
        <div className="min-h-[72vh]">
          <ChatWindow
            role={role}
            conversation={activeConversation}
            messages={activeMessages}
            onSendMessage={handleSendMessage}
          />
        </div>
      </div>
    </div>
  )
}
