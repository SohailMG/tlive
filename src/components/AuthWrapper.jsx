import React, { useState, useEffect, useContext } from "react";
import { auth, app } from "../firebase";
import {
  onAuthStateChanged,
  signInAnonymously,
  signOut,
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import {
  Button,
  FormGroup,
  InputGroup,
  Spinner,
  Tab,
  Tabs,
} from "@blueprintjs/core";
import { AppContext } from "../context/AppContext";
import { BiShowAlt } from "react-icons/bi";
import { useAuthState } from "react-firebase-hooks/auth";

function AuthWrapper({ children }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedTab, setSelectedTab] = useState("signIn");
  const [user, loading] = useAuthState(auth);
  const [error, setError] = useState(null);
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("USER => " + user);
        // ...
      } else {
        console.log("signed out");
        // User is signed out
      }
    });
  }, []);
  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((user) => {
        console.log("Signed in successfully");
      })
      .catch((error) => {
        console.error(error);
        setError(error.message);
      });
  };
  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((user) => {
        console.log("Signed up successfully");
      })
      .catch((error) => {
        console.error(error);
        setError(error.message);
      });
  };

  if (loading)
    return (
      <div className="min-w-[800px] px-4 min-h-screen flex items-center justify-center flex-col space-y-4">
        <h2 className="text-white font-bold">Please wait...</h2>
        <Spinner size={20} intent="primary" />
      </div>
    );

  if (user) return <>{children}</>;

  return (
    <div className=" min-w-[800px] px-4 min-h-screen flex items-center justify-center flex-col space-y-4">
      <div className="flex p-2">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/tlive-81354.appspot.com/o/icons8-live-64.png?alt=media&token=68a009a0-e5bd-4d9f-8598-74187c1f01fe"
          alt="Logo"
        />
        <h1 className="text-white font-bold self-end">TLive</h1>
      </div>
      <Tabs
        className="min-w-[400px]"
        id="LoginTabs"
        onChange={(e) => setSelectedTab(e)}
        selectedTabId={selectedTab}
      >
        <Tab
          id="signIn"
          title="SignIn"
          panel={
            <SignInForm
              setEmail={setEmail}
              setPassword={setPassword}
              error={error}
              password={password}
              email={email}
              handleSignIn={handleSignIn}
            />
          }
        />
        <Tab
          id="signUp"
          title="SignUp"
          panel={
            <SignUpForm
              setEmail={setEmail}
              setPassword={setPassword}
              error={error}
              password={password}
              email={email}
              handleSignUp={handleSignUp}
            />
          }
        />
      </Tabs>
    </div>
  );
}

export default AuthWrapper;

function SignUpForm({
  setEmail,
  setPassword,
  handleSignUp,
  error,
  password,
  email,
}) {
  const [currPassword, setCurrPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [errorMsg, setErrorMsg] = useState();

  useEffect(() => {
    if (confirmPassword) {
      if (confirmPassword === currPassword) {
        setErrorMsg("");
        setPassword(currPassword);
      } else {
        setErrorMsg("Passwords do not match");
        setPassword();
      }
    }
  }, [confirmPassword, currPassword]);

  return (
    <>
      <div className=" flex flex-col space-y-4 ">
        <FormGroup
          label="Email"
          className="text-white"
          labelFor="email"
          labelInfo="(required)"
        >
          <InputGroup
            title="Email"
            type="email"
            id="email"
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormGroup>
        <FormGroup
          label="Password"
          className="text-white"
          labelFor="password"
          labelInfo="(required)"
        >
          <InputGroup
            type="password"
            id="password"
            placeholder="Create Password"
            onChange={(e) => setCurrPassword(e.target.value)}
          />
        </FormGroup>
        <FormGroup
          label="Confirm Password"
          className="text-white"
          labelFor="confirmPassword"
          labelInfo="(required)"
        >
          <InputGroup
            type="password"
            id="confirmPassword"
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </FormGroup>
        <p className="text-red-400 text-xs">{error ?? errorMsg}</p>
        <Button
          disabled={!password | !email}
          onClick={handleSignUp}
          rightIcon="arrow-right"
          intent="success"
          style={{ background: "indigo" }}
          text="Sign Up"
        />
      </div>
    </>
  );
}

function SignInForm({
  setEmail,
  setPassword,
  handleSignIn,
  error,
  password,
  email,
}) {
  return (
    <>
      <div className=" flex flex-col space-y-4 p-4">
        <FormGroup
          label="Email"
          className="text-white"
          labelFor="email"
          labelInfo="(required)"
        >
          <InputGroup
            title="Email"
            type="email"
            id="email"
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormGroup>
        <FormGroup
          label="Password"
          className="text-white"
          labelFor="password"
          labelInfo="(required)"
        >
          <InputGroup
            type="password"
            rightElement={<BiShowAlt />}
            id="password"
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormGroup>
        <p className="text-red-400 text-xs">{error}</p>
        <Button
          disabled={!password | !email}
          onClick={handleSignIn}
          rightIcon="arrow-right"
          intent="success"
          style={{ background: "indigo" }}
          text="Sign in"
        />
      </div>
    </>
  );
}
