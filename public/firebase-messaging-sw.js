importScripts(
	"https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js",
);
importScripts(
	"https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js",
);

firebase.initializeApp({
	apiKey: "AIzaSyCQ_uI-RuoTzt0HE6-8Bdc1lsRpuAiyWRs",
	authDomain: "okusuri-fcm.firebaseapp.com",
	projectId: "okusuri-fcm",
	storageBucket: "okusuri-fcm.firebasestorage.app",
	messagingSenderId: "725863494",
	appId: "1:725863494:web:f812ecb4d5a8124a338e47",
	measurementId: "G-QGPNCZTBCL",
});

const messaging = firebase.messaging();

// 処理済みメッセージのIDを保存
const processedMessageIds = new Set();
let isHandlingMessage = false;

messaging.onBackgroundMessage((payload) => {
	console.log("バックグラウンドで受信したメッセージ:", payload);

	// メッセージIDを取得（ペイロードの構造によって異なる場合があります）
	const messageId =
		payload.messageId ||
		payload.data?.messageId ||
		JSON.stringify(payload.notification); // IDがない場合、通知内容で代用

	// 重複チェック
	if (messageId && processedMessageIds.has(messageId)) {
		console.log("すでに処理済みのメッセージです：", messageId);
		return;
	}

	if (isHandlingMessage) {
		console.log("メッセージ処理中のため、スキップします");
		return;
	}

	isHandlingMessage = true;

	// 処理済みとしてマーク
	if (messageId) {
		processedMessageIds.add(messageId);
		// メモリ管理のため、一定時間後に削除
		setTimeout(() => {
			processedMessageIds.delete(messageId);
		}, 300000); // 5分後に削除
	}

	const notificationTitle = payload.notification.title;
	const notificationOptions = {
		body: payload.notification.body,
		icon: "/logo.png",
		tag: messageId, // tagを設定すると同じtagの通知は上書きされる
	};

	self.registration
		.showNotification(notificationTitle, notificationOptions)
		.finally(() => {
			isHandlingMessage = false;
		});
});
