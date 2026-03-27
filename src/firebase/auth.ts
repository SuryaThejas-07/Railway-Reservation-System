import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./config";

export const registerUser = async (
  email: string,
  password: string,
  name: string,
  phone: string
) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  await setDoc(doc(db, "users", user.uid), {
    name,
    email,
    phone,
    role: "user",
    createdAt: serverTimestamp(),
  });
  return user;
};

export const loginUser = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const logoutUser = () => signOut(auth);

export const getUserRole = async (uid: string): Promise<string> => {
  const snap = await getDoc(doc(db, "users", uid));
  if (snap.exists()) return snap.data().role || "user";
  return "user";
};

export const subscribeAuth = (cb: (user: User | null) => void) =>
  onAuthStateChanged(auth, cb);

export const sendPasswordResetEmail = async (email: string) => {
  try {
    await firebaseSendPasswordResetEmail(auth, email);
    return true;
  } catch (error: any) {
    throw new Error(error.message || "Failed to send password reset email");
  }
};

export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Check if user already exists in Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    
    if (!userDoc.exists()) {
      // Create new user document
      await setDoc(doc(db, "users", user.uid), {
        name: user.displayName || "Google User",
        email: user.email,
        phone: user.phoneNumber || "",
        role: "user",
        profilePicture: user.photoURL || "",
        createdAt: serverTimestamp(),
      });
    }
    
    return user;
  } catch (error: any) {
    throw new Error(error.message || "Failed to sign in with Google");
  }
};
