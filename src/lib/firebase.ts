// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { type Messaging, getMessaging, isSupported } from "firebase/messaging";

// Firebase configuration
const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: "okusuri-fcm.firebaseapp.com",
	projectId: "okusuri-fcm",
	storageBucket: "okusuri-fcm.firebasestorage.app",
	messagingSenderId: "725863494",
	appId: "1:725863494:web:f812ecb4d5a8124a338e47",
	measurementId: "G-QGPNCZTBCL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// グローバル変数で1つのMessagingインスタンスのみを保持
let messagingInstance: Messaging | null = null;

/**
 * Firebase Messagingを初期化し、単一のインスタンスを返す
 * @returns Firebase Messagingインスタンス
 */
const initializeMessaging = async (): Promise<Messaging | null> => {
  // すでに初期化済みなら既存のインスタンスを返す
  if (messagingInstance) {
    console.log("Firebase Messagingはすでに初期化されています");
    return messagingInstance;
  }

  // ブラウザ環境でなければnullを返す
  if (typeof window === "undefined") {
    console.log("ブラウザ環境ではありません");
    return null;
  }

  try {
    // FCMがサポートされているか確認
    const isMessagingSupported = await isSupported();
    if (!isMessagingSupported) {
      console.warn("このブラウザはFirebase Cloud Messagingをサポートしていません");
      return null;
    }

    // 初期化処理
    console.log("Firebase Messagingを初期化中...");
    messagingInstance = getMessaging(app);
    console.log("Firebase Messagingの初期化に成功しました");
    return messagingInstance;
  } catch (error) {
    console.error("Firebase Messagingの初期化に失敗しました:", error);
    return null;
  }
};

// ブラウザ環境の場合は初期化を試みる
let messaging: Messaging | null = null;
if (typeof window !== "undefined") {
  initializeMessaging().then((instance) => {
    messaging = instance;
  });
}

export { app, messaging, initializeMessaging };
