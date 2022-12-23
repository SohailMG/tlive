// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getFirestore,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyDgoVk8VfPgYtlXDIpcgwHf9AZxepDCxbA",
  authDomain: "tlive-81354.firebaseapp.com",
  projectId: "tlive-81354",
  storageBucket: "tlive-81354.appspot.com",
  messagingSenderId: "509339902080",
  appId: "1:509339902080:web:57c95a2e1917e0c47c4665",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export { app, auth, db };

// DB Handlers
export async function addToDb(uuid, channelId, channelName) {
  try {
    const docRef = doc(db, "channels", uuid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("updating existing doc");
      await updateDoc(docRef, {
        savedChannels: arrayUnion({ channelId, channelName }),
      });
    } else {
      console.log("doc does not exist");
      await setDoc(docRef, {
        savedChannels: [
          {
            channelId,
            channelName,
          },
        ],
      });
      console.log("Added new channel", docRef);
    }
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export async function getChannelsFromDb(uuid) {
  try {
    const docRef = doc(db, "channels", uuid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      return docSnap.data().savedChannels;
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
      return s;
    }
  } catch (error) {}
}

export async function removeChannelsFromDb(uuid, channelData) {
  try {
    const docRef = doc(db, "channels", uuid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      await updateDoc(docRef, {
        savedChannels: arrayRemove(channelData),
      });
    }
  } catch (error) {
    console.log(error);
  }
}
