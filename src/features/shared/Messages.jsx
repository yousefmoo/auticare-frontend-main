import { useMemo, useState } from "react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { MessageSquare, Send, Search } from "lucide-react";

const mockConversations = [
  {
    id: "c1",
    name: "Dr. Ahmed Ali",
    avatar: "",
    lastMessage: "Thanks — I updated the plan.",
    time: "2h",
    unread: 1,
    messages: [
      {
        id: "m1",
        fromMe: false,
        text: "Hi, can we review the latest progress?",
      },
      {
        id: "m2",
        fromMe: true,
        text: "Sure — I scheduled a session for Monday.",
      },
    ],
  },
  {
    id: "c2",
    name: "Sara Ahmed (Therapist)",
    avatar: "",
    lastMessage: "Nice work with the activities.",
    time: "1d",
    unread: 0,
    messages: [
      { id: "m3", fromMe: false, text: "Please share the home activities." },
      { id: "m4", fromMe: true, text: "Sent them to your email." },
    ],
  },
];

export default function Messages() {
  const [conversations, setConversations] = useState(mockConversations);
  const [activeId, setActiveId] = useState(mockConversations[0]?.id);
  const [text, setText] = useState("");
  const [query, setQuery] = useState("");

  const active =
    conversations.find((c) => c.id === activeId) || conversations[0];

  const handleSend = () => {
    if (!text.trim()) return;

    const newMessage = {
      id: `m${Date.now()}`,
      fromMe: true,
      text: text.trim(),
    };

    const updated = conversations.map((conv) => {
      if (conv.id !== active.id) return conv;
      const updatedMessages = [...conv.messages, newMessage];
      return {
        ...conv,
        messages: updatedMessages,
        lastMessage: newMessage.text,
        time: "now",
        unread: 0,
      };
    });

    setConversations(updated);
    setText("");
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.lastMessage.toLowerCase().includes(q),
    );
  }, [conversations, query]);

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden h-[72vh]">
      <div className="grid grid-cols-12 h-full">
        {/* Left: conversations */}
        <div className="col-span-4 border-r">
          <div className="p-3 border-b">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold">Messages</h3>
              </div>
              <Button variant="outline" size="sm">
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
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search conversations"
                  className="!p-2"
                />
              </div>
            </div>
          </div>

          <div className="p-3 space-y-2 overflow-y-auto h-[calc(72vh-120px)]">
            {filtered.length === 0 && (
              <div className="text-sm text-gray-500 p-3">
                No conversations found
              </div>
            )}
            {filtered.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className={`w-full text-left flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors ${
                  c.id === activeId ? "bg-primary-50" : ""
                }`}
              >
                <div className="rounded-full bg-gray-200 w-12 h-12 flex items-center justify-center text-sm font-medium text-gray-700">
                  {c.name.split(" ")[0][0]}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <div className="font-medium text-sm">{c.name}</div>
                    <div className="text-xs text-gray-400">{c.time}</div>
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    {c.lastMessage}
                  </div>
                </div>
                {c.unread > 0 && (
                  <div className="ml-2 bg-danger-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {c.unread}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right: chat */}
        <div className="col-span-8 flex flex-col">
          {!active ? (
            <div className="h-full flex items-center justify-center text-gray-500">
              No conversations yet. Select one or start a new chat.
            </div>
          ) : (
            <>
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-gray-200 w-12 h-12 flex items-center justify-center text-sm font-medium text-gray-700">
                    {active.name.split(" ")[0][0]}
                  </div>
                  <div>
                    <div className="font-semibold">{active.name}</div>
                    <div className="text-xs text-gray-500">
                      Last seen {active.time} ago
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-xs text-gray-500">
                    {active.messages.length} messages
                  </div>
                  <Button variant="ghost" size="sm">
                    Details
                  </Button>
                </div>
              </div>

              <div className="p-4 flex-1 overflow-y-auto space-y-3">
                {active.messages.map((m) => (
                  <div
                    key={m.id}
                    className={`max-w-[70%] ${m.fromMe ? "ml-auto text-right" : ""}`}
                  >
                    <div
                      className={`inline-block px-4 py-2 rounded-xl ${m.fromMe ? "bg-primary-500 text-white" : "bg-gray-100 text-gray-800"}`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t">
                <div className="flex gap-3 items-center">
                  <Input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1"
                  />
                  <Button onClick={handleSend} variant="primary" size="md">
                    <Send className="w-4 h-4 mr-2" /> Send
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
