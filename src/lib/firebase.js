import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBvPilClD3gmfr7QQabqLsDzLF6PQfdY84",
  authDomain: "itss-firebase-b96c0.firebaseapp.com",
  projectId: "itss-firebase-b96c0",
  storageBucket: "itss-firebase-b96c0.appspot.com",
  messagingSenderId: "673986125076",
  appId: "1:673986125076:web:faed37e9430271524a7601",
  measurementId: "G-MGPJR2F6ZS"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
export default firebase;
export const auth = firebase.auth();

// Todoコレクションの全documentを取得する：
export const getFirebaseItems = async () => {
  try {
    const snapshot = await db
      .collection("todos")
      .get();
    const items = snapshot.docs.map(
      (doc) => ({ ...doc.data(), id: doc.id })
    );
    return items;
  } catch (err) {
      console.log(err);
    return [];
  }
}

// 新しいTodoをFirestoreに保存する：
export const addFirebaseItem = async (item) => {
  try {
    const todoRef = db.collection("todos");
    await todoRef.add(item);
  } catch (err) {
    console.log(err);
  }
}

// Todoの情報を更新する：
export const updateFirebaseItem = async (item, id) => {
  try {
    const todoRef = db.collection("todos").doc(id);
    await todoRef.update(item);
  } catch (err) {
    console.log(err);
  }
}

// 任意のTodoを削除する
export const deleteFirebaseItem = async (item) => {
  const todoRef = db.collection("todos").doc(item.id);
  await todoRef.delete().then(function () {
  }).catch(function (err) {
    console.log(err);
  });
};

export const uiConfig = {
  signInFlow: 'popup',
  signInSuccessUrl: "/",
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  ],
}

// 
export const storeUserInfo = async (user) => {
  const { uid } = user;
  const userDoc = await db.collection("users").doc(uid).get();
  if (!userDoc.exists) {
    await db.collection("users").doc(uid).set({ name: user.displayName });
    return {
      name: user.displayName,
      id: uid,
    };
  } else {
    return {
      id: uid,
      ...userDoc.data(),
    };
  }
}

export const updateUser = async (user, image) => {
  try {
    const userDoc = await firebase.firestore().collection("users").doc(user.id).get();
    if (userDoc.exists) {
      await firebase.firestore().collection("users").doc(user.id).update({ ...userDoc.data(), image: image });
    }
    console.log(userDoc)
  } catch (err) {
    console.log(err);
  }
}

export const uploadImage = async (image) => {
  // const userRef = firebase.storage.ref(`/images/${image.name}`);
  const ref = firebase.storage().ref().child(`/images/${image.name}`);
  let downloadUrl = "";
  try {
    await ref.put(image);
    downloadUrl = await ref.getDownloadURL();
  } catch (err) {
    console.log(err);
  }
  return downloadUrl;
};

