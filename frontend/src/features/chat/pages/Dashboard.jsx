import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useChat } from "../hooks/useChat";
import { Menu, X, Send, LogOut } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const Dashboard = () => {
  const chat = useChat();
  const { user } = useSelector((state) => state.auth);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");

  const chats = useSelector((state) => state.chat.chats);
  const currentChatId = useSelector((state) => state.chat.currentChatId);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedMessage = chatInput.trim();
    if (!trimmedMessage) return;

    chat.handleSendMessage({
      message: trimmedMessage,
      chatId: currentChatId,
    });

    setChatInput("");
  };

  const chatss = ["jiii", "jlkj", "lkk"];

  useEffect(() => {
    chat.initializeSocketConnection();
    chat.handleGetChats();
  }, []);

  const openChat = (chatId) => {
    chat.handleOpenChat(chatId);
  }

  return (
    <main className="h-screen w-full flex bg-gradient-to-br from-[#0f172a] to-[#020617] text-white overflow-hidden">
      
      <div
        className={`fixed md:relative z-50 h-full ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } transition-all duration-300 w-64 bg-[#020617]/90 backdrop-blur-xl border-r border-white/10 flex flex-col`}
      >
        
        <div className="flex items-center justify-between p-4">
          <h1 className="text-lg font-semibold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
            MyAI
          </h1>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        
        <div className="flex-1 overflow-y-auto px-2">
          {Object.values(chats).map((chat, i) => (
            <button
            onClick={()=>{openChat(chat.id)}}
              key={i}
              className="p-3 rounded-xl hover:bg-white/10 cursor-pointer text-sm mb-1 truncate"
            >
              {chat?.title || "New Chat"}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-white/10 text-sm flex items-center justify-between">
          <div className="truncate">{user?.username}</div>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            className="p-2 rounded-lg hover:bg-red-500/20 text-red-400"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}


      <div className="flex-1 flex flex-col w-full">

        <div className="md:hidden flex items-center p-4 border-b border-white/10">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>
          <h1 className="ml-4 font-semibold">Chat</h1>
        </div>

 
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {chats?.[currentChatId]?.messages?.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] md:max-w-xl px-4 py-3 rounded-2xl text-sm shadow-lg ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-purple-600 to-blue-500"
                    : "bg-white/10 backdrop-blur-md"
                }`}
              >
                <ReactMarkdown
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");

                      return !inline ? (
                        <SyntaxHighlighter
                          style={oneDark}
                          language={match ? match[1] : "javascript"}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code className="bg-black/30 px-1 rounded">
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}

          {!chats?.[currentChatId]?.messages?.length && (
            <div className="text-center text-white/40 mt-10">
              Start a conversation...
            </div>
          )}
        </div>

        <div className="p-3 md:p-4 border-t border-white/10">
          <form
            onSubmit={handleSubmit}
            className="flex items-center bg-white/10 backdrop-blur-lg rounded-2xl px-3 md:px-4 py-2"
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 bg-transparent outline-none text-sm"
            />

            <button
              type="submit"
              // disabled={!message.trim()}
              className="ml-2 p-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-80 disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
