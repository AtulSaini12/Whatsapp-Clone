import styled from "styled-components";
import { useState, useRef } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { auth, db } from "../firebase";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { Avatar } from "@material-ui/core";
import { IconButton } from "@material-ui/core";
import { MoreVert, AttachFile, InsertEmoticon, Mic } from "@material-ui/icons";
import { useCollection } from "react-firebase-hooks/firestore";
import getRecipientEmail from "../utils/getRecipientEmail";
import Message from "./Message";
import TimeAgo from "timeago-react";

function ChatScreen({ chat, messages }) {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [input, setInput] = useState("");
  const endOfMessageRef = useRef(null);
  const [messagesSnapshot] = useCollection(
    db
      .collection("chats")
      .doc(router.query.id)
      .collection("messages")
      .orderBy("timestamp", "asc")
  );

  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message) => (
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
        />
      ));
    } else {
      return JSON.parse(messages).map((message) => (
        <Message key={message.id} user={message.user} message={message} />
      ));
    }
  };

  const [recipientSnapshot] = useCollection(db.collection("users"));

  const scrollToBottom = () => {
    endOfMessageRef.current.scrollIntoView({
      behaviour: "smooth",
      block: "start",
    });
  };
  const sendMessage = (e) => {
    e.preventDefault();

    db.collection("users").doc(user.uid).set(
      {
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    db.collection("chats").doc(router.query.id).collection("messages").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      user: user.email,
      input,
      photoURL: user.photoURL,
    });

    setInput("");
    scrollToBottom();
  };

  const recipientEmail = getRecipientEmail(chat.users, user);
  const recipient = recipientSnapshot?.docs
    .map((user) => user.data())
    .filter((user) => user.email === recipientEmail)[0];

  return (
    <Container>
      <Header>
        {recipient ? (
          <Avatar src={recipient?.photoURL} />
        ) : (
          <Avatar src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhVd3GPCoVmX_0yhy2X3oQ7WZ5nr1ceMsTHC_X_lvNk6cdE7VOg0COgmV2gwUwAt9g8FQ&usqp=CAU" />
        )}

        <HeaderInfo>
          <h3>{`${recipientEmail}`.substr(0, 10) + "..."}</h3>
          {recipientSnapshot ? (
            <p>
              Last active:{" "}
              {recipient?.lastSeen?.toDate() ? (
                <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
              ) : (
                "Unavailable"
              )}
            </p>
          ) : (
            <p>Loading Last active...</p>
          )}
        </HeaderInfo>
        <HeaderIcons>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </HeaderIcons>
      </Header>

      <MessageContainer>
        {showMessages()}
        <EndOfMessage ref={endOfMessageRef} />
      </MessageContainer>

      <InputContainer>
        <InsertEmoticon />
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="enter your message..."
        />
        <button hidden disabled={!input} type="submit" onClick={sendMessage}>
          Send Message
        </button>
        <Mic />
      </InputContainer>
    </Container>
  );
}

export default ChatScreen;

const Container = styled.div``;

const Header = styled.div`
  position: sticky;
  background-color: white;
  z-index: 100;
  top: 0;
  display: flex;
  padding: 11px;
  height: 80px;
  align-items: center;
  border-bottom: 1px solid whitesmoke;
  background-color: #1dd579;
`;

const HeaderInfo = styled.div`
  margin-left: 15px;
  flex: 1;

  > h3 {
    margin-bottom: 3px;
  }
  > p {
    font-size: 14px;
    color: gray;
  }
`;

const HeaderIcons = styled.div``;

const MessageContainer = styled.div`
  padding: 30px;
  background-image: url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png");
  background-repeat: repeat;
  background-position: center;
  background-color: #e5ded8;
  min-height: 90vh;
`;

const EndOfMessage = styled.div`
  margin-bottom: 50px;
`;

const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  background-color: #1dd579;
  z-index: 100;
`;

const Input = styled.input`
  flex: 1;
  outline: 0;
  border: none;
  border-radius: 10px;
  background-color: whitesmoke;
  padding: 20px;
  margin: auto 15px;
`;
