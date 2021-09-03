import styled from "styled-components";
import { Avatar, Button, IconButton } from "@material-ui/core";
import { Chat as ChatIcon, MoreVert, Search } from "@material-ui/icons";
import * as emailValidator from "email-validator";
import { auth, db } from "../firebase";
import "firebase/compat/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";

import Chat from "./Chat";

function Sidebar() {
  const [user] = useAuthState(auth);

  const userChatRef = db
    .collection("chats")
    .where("users", "array-contains", user.email);

  const [chatsSnapshot] = useCollection(userChatRef);

  const createChat = () => {
    const input = prompt(
      "Please enter an email address for the user, you wish to chat with"
    );

    if (!input) {
      return null;
    }
    if (
      emailValidator.validate(input) &&
      !chatExists(input) &&
      input !== user.email
    ) {
      console.log(input);
      console.log(chatsSnapshot);
      db.collection("chats").add({
        users: [user.email, input],
      });
    }
  };

  const chatExists = (chatEmail) => {
    return !!chatsSnapshot?.docs.find(
      (chat) => chat.data().users.find((user) => user === chatEmail)?.length > 0
    );
  };

  return (
    <Container>
      <Header>
        {user.photoURL ? (
          <UserAvatar src={user.photoURL} onClick={() => auth.signOut()} />
        ) : (
          <UserAvatar src={user.email[0]} onClick={() => auth.signOut()} />
        )}

        <IconsContainer>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </IconsContainer>
      </Header>

      <SearchContainer>
        <Search />
        <SearchInput placeholder="search" />
      </SearchContainer>

      <SidebarButton onClick={createChat}>Start a new chat</SidebarButton>

      {/* Chats List of Users */}
      {chatsSnapshot?.docs.map((chat) => (
        <Chat key={chat.id} id={chat.id} users={chat.data().users} />
      ))}
    </Container>
  );
}

export default Sidebar;

const Container = styled.div`
  flex: 0.45;
  border-right: 1px solid whitesmoke;
  height: 100vh;
  min-width: 300px;
  max-width: 350px;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
`;
const Header = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  height: 80px;
  border-bottom: 1px solid green;
  background-color: #1dd579;
`;

const UserAvatar = styled(Avatar)`
  cursor: pointer;

  :hover {
    opacity: 0.8;
  }
`;

const IconsContainer = styled.div``;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 2px;
  background-color: whitesmoke;
`;

const SearchInput = styled.input`
  outline-width: 0;
  border: none;
  flex: 1;
  background-color: whitesmoke;
`;

const SidebarButton = styled(Button)`
  width: 100%;
  background-color: #def2ea !important;
  transition: all 400ms;
  &&& {
    border-top: 1px solid whitesmoke;
    border-bottom: 1px solid whitesmoke;
  }

  :hover {
    background-color: #a8e1c9 !important;
  }
`;
