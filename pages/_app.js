import "../styles/globals.css";
import "firebase/compat/firestore";

import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";

import Login from "./login";
// import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import Loading from "../components/Loading";

//
//
//

function MyApp({ Component, pageProps }) {
  const [currUser, loading] = useAuthState(auth);

  useEffect(() => {
    if (currUser) {
      const docRef = doc(db, "users", currUser.uid);
      setDoc(
        docRef,
        {
          email: currUser.email,
          lastSeen: serverTimestamp(),
          photoURL: currUser.photoURL,
        },
        { merge: true }
      );
    }
  }, [currUser]);

  if (loading) return <Loading />;

  if (!currUser) {
    return <Login />;
  }
  return <Component {...pageProps} />;
}

export default MyApp;
