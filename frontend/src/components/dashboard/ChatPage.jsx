import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../../supabaseClient';
import './ChatPage.css';

const ChatPage = () => {
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  
  const messagesEndRef = useRef(null);
  const channelRef = useRef(null);

  useEffect(() => {
    // Get current user and contacts
    const initChat = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);

      if (user) {
        fetchContacts();
      }
    };
    initChat();

    return () => {
      // Cleanup subscription
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchContacts = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch("http://localhost:5000/chat/contacts", {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setContacts(data.contacts || []);
      }
    } catch (err) {
      console.error("Failed to load contacts:", err);
    } finally {
      setLoadingContacts(false);
    }
  };

  const selectContact = async (contact) => {
    setActiveContact(contact);
    setLoadingMessages(true);
    setMessages([]);
    setConversationId(null);
    
    // Cleanup previous subscription
    if (channelRef.current) {
      await supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      // 1. Get or create conversation
      const convRes = await fetch("http://localhost:5000/chat/conversations", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}` 
        },
        body: JSON.stringify({ target_user_id: contact.id })
      });
      const convData = await convRes.json();
      
      if (!convRes.ok) throw new Error(convData.message);
      
      const convId = convData.conversation_id;
      setConversationId(convId);

      // 2. Load messages
      const msgRes = await fetch(`http://localhost:5000/chat/conversations/${convId}/messages`, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      const msgData = await msgRes.json();
      
      if (msgRes.ok) {
        setMessages(msgData.messages || []);
      }

      // 3. Subscribe to real-time updates
      const channel = supabase
        .channel(`room_${convId}`)
        .on('postgres_changes', { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'messages',
            filter: `conversation_id=eq.${convId}`
          }, 
          (payload) => {
            const newMsg = payload.new;
            setMessages(prev => {
              // Avoid duplicates if we already optimistically added it
              if (prev.some(m => m.id === newMsg.id)) return prev;
              return [...prev, newMsg];
            });
          }
        )
        .subscribe();
        
      channelRef.current = channel;

    } catch (err) {
      console.error("Failed to setup conversation:", err);
      alert("Could not load conversation");
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !conversationId) return;

    const msgText = newMessage.trim();
    setNewMessage("");

    // Optimistic UI update (using temporary ID)
    const tempMsg = {
      id: `temp-${Date.now()}`,
      conversation_id: conversationId,
      sender_id: currentUser.id,
      message: msgText,
      created_at: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, tempMsg]);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`http://localhost:5000/chat/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}` 
        },
        body: JSON.stringify({ message: msgText })
      });

      const data = await res.json();
      if (res.ok) {
        // Replace temp message with actual message from DB
        setMessages(prev => prev.map(m => m.id === tempMsg.id ? data.message : m));
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      // Remove failed optimistic message
      setMessages(prev => prev.filter(m => m.id !== tempMsg.id));
      alert("Failed to send message.");
    }
  };

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() : '?';
  };

  const formatTime = (isoString) => {
    if (!isoString) return '';
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chat-layout">
      <div className="chat-sidebar">
        <div className="chat-sidebar-header">
          <h3>Chats</h3>
        </div>
        
        <div className="chat-contact-list">
          {loadingContacts ? (
            <div className="chat-loading"><i className="fas fa-spinner fa-spin"></i> Loading contacts...</div>
          ) : contacts.length === 0 ? (
            <div className="chat-empty-state">No connected contacts yet. Make connections first!</div>
          ) : (
            contacts.map(contact => (
              <div 
                key={contact.id} 
                className={`chat-contact-item ${activeContact?.id === contact.id ? 'active' : ''}`}
                onClick={() => selectContact(contact)}
              >
                <div className="contact-avatar">
                  {contact.profile_image ? (
                    <img src={contact.profile_image} alt={contact.name} />
                  ) : (
                    <span>{getInitials(contact.name)}</span>
                  )}
                </div>
                <div className="contact-info">
                  <h4>{contact.name || "Unknown"}</h4>
                  <p>{contact.role || "User"}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="chat-main">
        {activeContact ? (
          <>
            <div className="chat-main-header">
              <div className="contact-avatar small">
                {activeContact.profile_image ? (
                  <img src={activeContact.profile_image} alt={activeContact.name} />
                ) : (
                  <span>{getInitials(activeContact.name)}</span>
                )}
              </div>
              <div className="header-info">
                <h3>{activeContact.name}</h3>
              </div>
            </div>

            <div className="chat-messages-container">
              {loadingMessages ? (
                <div className="chat-loading"><i className="fas fa-spinner fa-spin"></i> Loading messages...</div>
              ) : messages.length === 0 ? (
                <div className="chat-empty-state">Say hi to {activeContact.name}!</div>
              ) : (
                <div className="messages-list">
                  {messages.map((msg, index) => {
                    const isMine = currentUser && msg.sender_id === currentUser.id;
                    return (
                      <div key={msg.id || index} className={`message-wrapper ${isMine ? 'mine' : 'theirs'}`}>
                        <div className="message-bubble">
                          <p>{msg.message}</p>
                          <span className="message-time">{formatTime(msg.created_at)}</span>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            <form className="chat-input-area" onSubmit={handleSendMessage}>
              <button type="button" className="btn-attachment">
                <i className="fas fa-paperclip"></i>
              </button>
              <input 
                type="text" 
                placeholder="Type a message" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                autoFocus
              />
              <button type="submit" className="btn-send" disabled={!newMessage.trim()}>
                <i className="fas fa-paper-plane"></i>
              </button>
            </form>
          </>
        ) : (
          <div className="chat-no-selection">
            <div className="no-selection-content">
              <i className="fas fa-comments"></i>
              <h2>VisionEd Messages</h2>
              <p>Select a contact to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
