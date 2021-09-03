import { Button } from "@material-ui/core";
import Head from "next/head";
import styled from "styled-components";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import "firebase/compat/auth";
import { ImportantDevices } from "@material-ui/icons";

function Login() {
  const signIn = () => {
    signInWithPopup(auth, provider)
      .then((res) => {
        const credential = GoogleAuthProvider.credentialFromResult(res);
        const token = credential.accessToken;
        const user = result.user;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Container>
      <Head>
        <title>Login</title>
      </Head>

      <LoginContainer>
        <Logo src="http://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png" />
        <ButtonStyled onClick={signIn} variant="outlined">
          Sign in with Google
        </ButtonStyled>
      </LoginContainer>
    </Container>
  );
}

export default Login;

const Container = styled.div`
  display: grid;
  place-items: center;
  height: 100vh;
  background-color: #0f844a;
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 5em;
  align-items: center;
  background-color: ghostwhite;
  border-radius: 8px;
  box-shadow: 0px 4px 14px -3px rgba(0, 0, 0, 0.7);
`;

const Logo = styled.img`
  height: 80%;
  width: 80%;
  max-height: 150px;
  min-height: 100px;
  max-width: 150px;
  min-width: 100px;
  margin-bottom: 30px;
`;

const ButtonStyled = styled(Button)`
  width: 100%;
  font-weight: bold !important;
  background-color: whitesmoke;
  color: #2dd349;
  border: 2px solid #2dd349 !important;
`;
