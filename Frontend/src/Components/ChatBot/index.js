import React, { useEffect, useState, useRef } from "react";
import { IoIosChatboxes, IoMdClose } from "react-icons/io";
import { FaRobot } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import axios from "axios";

import "../../css/chatbot.css";
import { getCurrentUser } from "../../services/LoginReg";

export default function ChatBot() {
  const [showChatBot, setShowChatBot] = useState(false);
  const [newMsg, setNewMsg] = useState(false);
  const [query, setQuery] = useState("");
  const [api, setApi] = useState({
    loading: true,
    error: false,
    data: [],
  });

  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (showChatBot && newMsg) setNewMsg(false);
  }, [newMsg, showChatBot]);

  useEffect(() => {
    if (chatContainerRef.current)
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
  }, [api.data]);

  useEffect(() => {
    callServer("hai", { loading: true, error: false, data: [] });
  }, []);

  async function askQuery(e) {
    e.preventDefault();
    if (query.trim().length === 0) return;

    let newData = {
      loading: true,
      error: false,
      data: [{ isClient: true, query }, ...api.data],
    };
    setApi({ ...newData });
    setQuery("");
    await callServer(query, newData);
  }

  async function callServer(query, newData) {
    await axios
      .post(process.env.REACT_APP_CHAT_BOT_URL, {
        message: query,
        isLoggedIn: getCurrentUser() ? true : false,
      })
      .then(({ data }) => {
        newData.data.unshift(data);
        setNewMsg(true);
      })
      .catch(() => {
        newData.error = true;
      });
    setApi({ ...newData, loading: false });
  }

  function handleQueryChange(e) {
    setQuery(e.target.value);
  }

  return (
    <>
      {showChatBot && (
        <div className="chatbot-container">
          <div className="chatbot-head">
            <span>
              <FaRobot />
            </span>
            <div>
              <h5>ChatterBot</h5>
            </div>
          </div>
          <div className="chatbot-content">
            {api.error ? (
              <p className="chatbot-error">
                Oops! I'm unable to process your message at the moment.
              </p>
            ) : (
              ""
            )}
            <ul ref={chatContainerRef}>
              {api.data.map((val, index) => (
                <li key={index} className={val.isClient ? `chat-right` : ""}>
                  {val.isClient ? (
                    <span className="client-chat-head">You</span>
                  ) : (
                    <span className="bot-chat-head">
                      <FaRobot />
                    </span>
                  )}
                  <p>{val.query}</p>
                </li>
              ))}
            </ul>
          </div>
          <form onSubmit={askQuery} className="chatbot-input">
            <input
              onChange={handleQueryChange}
              value={query}
              type="text"
              placeholder={
                api.loading
                  ? "Please wait..."
                  : "Tell me what you're looking for..."
              }
              disabled={api.loading}
            />
            <button disabled={api.loading} type="submit">
              <IoMdSend />
            </button>
          </form>
        </div>
      )}
      <div className="chatbot-toggle">
        {newMsg && <span className="new-msg" />}
        <button onClick={() => setShowChatBot(!showChatBot)}>
          {showChatBot ? <IoMdClose /> : <IoIosChatboxes />}
        </button>
      </div>
    </>
  );
}
