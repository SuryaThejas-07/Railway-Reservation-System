import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  increment,
} from "firebase/firestore";
import { db } from "./config";

// Generic helpers
export const getCollection = async (name: string) => {
  const snap = await getDocs(collection(db, name));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const getDocument = async (col: string, id: string) => {
  const snap = await getDoc(doc(db, col, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const addDocument = async (col: string, data: Record<string, unknown>) =>
  addDoc(collection(db, col), { ...data, createdAt: serverTimestamp() });

export const updateDocument = async (col: string, id: string, data: Record<string, unknown>) =>
  updateDoc(doc(db, col, id), data);

export const deleteDocument = async (col: string, id: string) =>
  deleteDoc(doc(db, col, id));

export const queryCollection = async (
  col: string,
  field: string,
  op: "==" | "!=" | "<" | ">" | "<=" | ">=",
  value: unknown
) => {
  const q = query(collection(db, col), where(field, op, value));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const incrementField = async (col: string, id: string, field: string, val: number) =>
  updateDoc(doc(db, col, id), { [field]: increment(val) });

export { serverTimestamp };
