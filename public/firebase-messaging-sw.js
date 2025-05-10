// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
// Replace 10.13.2 with latest version of the Firebase JS SDK.
importScripts(
	"https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js",
);
importScripts(
	"https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js",
);

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
	apiKey: "AIzaSyCQ_uI-RuoTzt0HE6-8Bdc1lsRpuAiyWRs",
	authDomain: "okusuri-fcm.firebaseapp.com",
	projectId: "okusuri-fcm",
	storageBucket: "okusuri-fcm.firebasestorage.app",
	messagingSenderId: "725863494",
	appId: "1:725863494:web:f812ecb4d5a8124a338e47",
	measurementId: "G-QGPNCZTBCL",
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

// バックグラウンドメッセージの処理
// 重複チェックを追加
let isHandlingMessage = false;

messaging.onBackgroundMessage((payload) => {
	if (isHandlingMessage) {
		console.log("メッセージ処理中のため、スキップします");
		return;
	}

	isHandlingMessage = true;

	console.log("バックグラウンドで受信したメッセージ:", payload);

	const notificationTitle = payload.notification.title;
	const notificationOptions = {
		body: payload.notification.body,
		icon: "/logo.png",
	};

	self.registration
		.showNotification(notificationTitle, notificationOptions)
		.finally(() => {
			isHandlingMessage = false;
		});
});
