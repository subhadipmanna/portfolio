import React, { useState, useRef, useEffect } from "react";
import { Send, X, MessageSquare, Sparkles, Bot, Smile } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../miniComponents/jui/avatar";
import { cn } from "../../lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

const buttonVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

const chatVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 400, damping: 20 } },
  exit: { opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.2 } },
};

const messageVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      content: "**Hey! I'm Amit's AI assistant. What do you want to know about him?**",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const scrollAreaRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions] = useState([
    "What's Amit good at?",
    "What's he worked on?",
    "What's Amit Qualifications?",
    "How can I collaborate with Amit?",
  ]);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api/chat";

  const toggleChat = () => setIsOpen(!isOpen);

  const handleInputChange = (e) => {
    setInput(e.target.value);
    setIsTyping(e.target.value.length > 0);
  };

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100);
      inputRef.current?.focus();
    }
  }, [messages, isOpen]);

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    handleSubmit(new Event("submit"), suggestion);
  };

  const handleSubmit = async (e, suggestedInput) => {
    e.preventDefault();
    const messageText = suggestedInput || input;
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      content: messageText,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(false);
    setIsLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          history: messages.map((msg) => ({ role: msg.role, content: msg.content })),
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();
      const botMessage = {
        id: Date.now().toString() + "-bot",
        content: data.response,
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = {
        id: Date.now().toString() + "-error",
        content: "Sorry, I hit a snag. Try again?",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed right-4 z-50 bottom-20 md:bottom-6 md:right-6">
      {isOpen ? (
        <motion.div variants={chatVariants} initial="hidden" animate="visible" exit="exit">
          <Card className="w-[90vw] h-[90vh] max-h-[600px] md:w-[450px] md:h-[850px] flex flex-col shadow-2xl border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
            
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b dark:border-gray-700 bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-600 text-white shadow-md">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 md:h-6 md:w-6" />
                <h3 className="text-base font-semibold md:text-lg">Amit's Assistant</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleChat}
                className="h-8 w-8 md:h-9 md:w-9 rounded-full hover:bg-white/20"
              >
                <X className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </div>

            {/* Chat Area */}
            <div
              ref={scrollAreaRef}
              className="flex-1 p-4 md:p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600"
            >
              <div className="flex flex-col gap-4">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      variants={messageVariants}
                      initial="hidden"
                      animate="visible"
                      className={cn("flex gap-3 max-w-[85%]", message.role === "user" ? "ml-auto" : "")}
                    >
                      {message.role === "assistant" && (
                        <Avatar className="h-8 w-8 md:h-10 md:w-10 border shadow-sm ring-2 ring-purple-200 dark:ring-purple-700">
                          <AvatarImage src="/logo.png" alt="Amit's Assistant" />
                          <AvatarFallback>
                            <Bot className="h-4 w-4 md:h-5 md:w-5" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={cn(
                          "rounded-2xl p-3 md:p-4 shadow-md text-sm md:text-base",
                          message.role === "user"
                            ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
                            : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                        )}
                      >
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                        <p className="text-xs opacity-70 mt-2 md:text-sm">
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                      {message.role === "user" && (
                        <Avatar className="h-8 w-8 md:h-10 md:w-10 border shadow-sm ring-2 ring-purple-200 dark:ring-purple-700">
                          <AvatarFallback>
                            <Smile className="h-4 w-4 md:h-5 md:w-5" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                {isLoading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                    <Avatar className="h-8 w-8 md:h-10 md:w-10 border shadow-sm ring-2 ring-purple-200 dark:ring-purple-700">
                      <AvatarImage src="/logo.jpg" alt="Amit's Assistant" />
                      <AvatarFallback>
                        <Bot className="h-4 w-4 md:h-5 md:w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-3 md:p-4 shadow-md">
                      <div className="flex space-x-2">
                        <motion.div
                          className="h-2 w-2 md:h-2.5 md:w-2.5 rounded-full bg-purple-500"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity }}
                        />
                        <motion.div
                          className="h-2 w-2 md:h-2.5 md:w-2.5 rounded-full bg-purple-500"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.5, delay: 0.2, repeat: Infinity }}
                        />
                        <motion.div
                          className="h-2 w-2 md:h-2.5 md:w-2.5 rounded-full bg-purple-500"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.5, delay: 0.4, repeat: Infinity }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Suggestions */}
            <div className="px-4 pb-4 md:px-6 md:pb-6 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 md:text-sm">Try these:</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs py-1 px-2 h-auto md:text-sm md:py-1.5 md:px-3 rounded-full border-gray-300 dark:border-gray-600 hover:bg-purple-100 dark:hover:bg-purple-900"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="sticky bottom-0 p-4 md:p-6 border-t dark:border-gray-700 bg-gradient-to-t from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
              <div className="flex gap-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask me anything about Amit..."
                  className="flex-1 px-4 py-2 md:px-5 md:py-3 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm md:text-base shadow-sm"
                  disabled={isLoading}
                />
                <motion.div variants={buttonVariants} initial="initial" whileHover="hover" whileTap="tap">
                  <Button
                    type="submit"
                    size="icon"
                    disabled={isLoading || !input.trim()}
                    className="rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white h-10 w-10 md:h-12 md:w-12 shadow-md"
                  >
                    <Send className="h-4 w-4 md:h-5 md:w-5" />
                  </Button>
                </motion.div>
              </div>
            </form>
          </Card>
        </motion.div>
      ) : (
        <motion.div variants={buttonVariants} initial="initial" whileHover="hover" whileTap="tap">
          <Button
            onClick={toggleChat}
            size="icon"
            className="h-14 w-14 md:h-16 md:w-16 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white shadow-xl"
          >
            <MessageSquare className="h-6 w-6 md:h-7 md:w-7" />
            <span className="absolute top-1 right-1 h-3 w-3 md:h-4 md:w-4 rounded-full bg-green-400 border-2 border-white" />
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default ChatBot;
