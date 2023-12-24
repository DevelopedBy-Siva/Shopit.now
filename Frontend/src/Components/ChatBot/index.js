import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { IoIosChatboxes, IoMdClose, IoMdSend } from "react-icons/io";
import { FaRobot } from "react-icons/fa";
import axios from "axios";

import { getCurrentUser } from "../../services/LoginReg";

import "../../css/chatbot.css";

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
    callServer("hai", { loading: true, error: false, data: [] }, true);
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

  function processChatResponse(data) {
    const response = data.split("___");
    let value = response[0];

    let redirect;
    let redirect_msg = "Click Here";
    switch (response[1]) {
      case "track":
        redirect = "/account?order=_";
        break;
      case "address":
        redirect = "/account?address=_";
        break;
      case "password":
        redirect = "/account?password=_";
        break;
      case "deals":
        redirect = "/search/_?deals=_";
        break;
      case "login":
        redirect = "/login";
        redirect_msg = "Login";
        break;
      default:
        redirect = null;
    }
    return (
      <RedirectChatResponse
        value={value}
        redirect={redirect}
        redirect_msg={redirect_msg}
      />
    );
  }

  function RedirectChatResponse({ value, redirect, redirect_msg }) {
    return (
      <span>
        {value}
        {redirect ? (
          <Link to={redirect} className="chat-redirect">
            {redirect_msg}
          </Link>
        ) : (
          ""
        )}
      </span>
    );
  }

  async function callServer(query, newData, started = false) {
    await axios
      .post(process.env.REACT_APP_CHAT_BOT_URL, {
        message: query,
        started,
        isLoggedIn: getCurrentUser() ? true : false,
      })
      .then(({ data }) => {
        newData.data.unshift(data);
        if (started && data["started"])
          newData.data.unshift({ query: data["started"], ico: true });
        if (data["isLogged"])
          newData.data.unshift({
            query: "To use this feature, log in to your account first.___login",
            ico: true,
          });
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
              {api.data.map((val, index) => {
                return (
                  <li
                    key={index}
                    className={`${val.isClient ? "chat-right " : ""}${
                      val.ico ? "ls-padding" : ""
                    }`}
                  >
                    {val.isClient ? (
                      <span className="client-chat-head">You</span>
                    ) : !val.ico ? (
                      <span className="bot-chat-head">
                        <FaRobot />
                      </span>
                    ) : (
                      ""
                    )}
                    <p>{processChatResponse(val.query)}</p>
                  </li>
                );
              })}
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
