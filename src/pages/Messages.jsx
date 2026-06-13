import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, ArrowLeft, Paperclip, Clock, CheckCheck } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const userInstance = await base44.auth.me().catch(() => null);
    setUser(userInstance);
  };

  const { data: conversations = [] } = useQuery({
    queryKey: ['conversations', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      
      const messages = await base44.entities.Message.filter(
        { $or: [{ sender_email: user.email }, { receiver_email: user.email }] },
        '-created_date'
      );
      
      // Group by conversation_id
      const convMap = new Map();
      messages.forEach(msg => {
        if (!convMap.has(msg.conversation_id)) {
          convMap.set(msg.conversation_id, {
            conversation_id: msg.conversation_id,
            property_id: msg.property_id,
            other_party: msg.sender_email === user.email ? msg.receiver_email : msg.sender_email,
            last_message: msg.message,
            last_message_date: msg.created_date,
            unread_count: msg.is_read || msg.sender_email === user.email ? 0 : 1
          });
        } else {
          const conv = convMap.get(msg.conversation_id);
          if (new Date(msg.created_date) > new Date(conv.last_message_date)) {
            conv.last_message = msg.message;
            conv.last_message_date = msg.created_date;
          }
          if (!msg.is_read && msg.receiver_email === user.email) {
            conv.unread_count++;
          }
        }
      });
      
      return Array.from(convMap.values());
    },
    enabled: !!user?.email
  });

  const { data: messages = [] } = useQuery({
    queryKey: ['messages', selectedConversation],
    queryFn: () => base44.entities.Message.filter(
      { conversation_id: selectedConversation },
      'created_date'
    ),
    enabled: !!selectedConversation
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (messageData) => {
      return base44.entities.Message.create(messageData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      setNewMessage("");
    }
  });

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation || !user) return;

    const conversation = conversations.find(c => c.conversation_id === selectedConversation);
    
    sendMessageMutation.mutate({
      conversation_id: selectedConversation,
      property_id: conversation.property_id,
      sender_email: user.email,
      receiver_email: conversation.other_party,
      sender_name: user.full_name || user.email,
      message: newMessage,
      is_read: false,
      message_type: "text"
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <MessageSquare className="w-16 h-16 text-orange-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
          <p className="text-gray-600">You need to be logged in to view messages</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-b from-orange-50 to-amber-50 flex flex-col">
      <div className="p-6 border-b bg-white">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <MessageSquare className="w-8 h-8 text-orange-500" />
          Messages
        </h1>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Conversations List */}
        <div className="w-full md:w-96 border-r bg-white overflow-y-auto">
          <div className="p-4">
            <h3 className="font-semibold text-gray-700 mb-4">Conversations</h3>
            {conversations.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No conversations yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {conversations.map((conv) => (
                  <Card
                    key={conv.conversation_id}
                    className={`cursor-pointer transition-all ${
                      selectedConversation === conv.conversation_id
                        ? 'border-orange-500 bg-orange-50'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedConversation(conv.conversation_id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{conv.other_party}</p>
                          <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                            {conv.last_message}
                          </p>
                        </div>
                        {conv.unread_count > 0 && (
                          <Badge className="bg-orange-500 text-white">
                            {conv.unread_count}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {format(new Date(conv.last_message_date), 'MMM d, h:mm a')}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender_email === user.email ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-md px-4 py-3 rounded-2xl ${
                        msg.sender_email === user.email
                          ? 'bg-orange-500 text-white'
                          : 'bg-white border'
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                      <div className="flex items-center gap-1 justify-end mt-1">
                        <span className={`text-xs ${
                          msg.sender_email === user.email ? 'text-orange-100' : 'text-gray-500'
                        }`}>
                          {format(new Date(msg.created_date), 'h:mm a')}
                        </span>
                        {msg.sender_email === user.email && msg.is_read && (
                          <CheckCheck className="w-3 h-3 text-orange-100" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t bg-white">
                <div className="flex items-center gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p>Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}