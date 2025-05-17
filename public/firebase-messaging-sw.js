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

// 処理済みメッセージのIDを保存するためのキャッシュ
const CACHE_NAME = 'notification-cache';

// メッセージIDの取得関数
function getMessageId(payload) {
  return payload.messageId || 
         payload.data?.messageId || 
         (payload.notification ? `${payload.notification.title}-${payload.notification.body}` : null) || 
         JSON.stringify(payload); // 最終手段
}

// キャッシュにメッセージIDを保存
async function saveProcessedMessageId(messageId) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const response = new Response(JSON.stringify({ processed: true, timestamp: Date.now() }));
    await cache.put(`/message/${messageId}`, response);
    
    // 古いキャッシュをクリーンアップ (5分以上前のエントリを削除)
    cleanupCache();
  } catch (error) {
    console.error('キャッシュの保存に失敗しました:', error);
  }
}

// キャッシュからメッセージIDを確認
async function checkIfMessageProcessed(messageId) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const response = await cache.match(`/message/${messageId}`);
    return response !== undefined;
  } catch (error) {
    console.error('キャッシュの確認に失敗しました:', error);
    return false;
  }
}

// 古いキャッシュをクリーンアップ
async function cleanupCache() {
  try {
    const cache = await caches.open(CACHE_NAME);
    const keys = await cache.keys();
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;
    
    for (const request of keys) {
      const response = await cache.match(request);
      const data = await response.json();
      
      if (now - data.timestamp > fiveMinutes) {
        await cache.delete(request);
      }
    }
  } catch (error) {
    console.error('キャッシュのクリーンアップに失敗しました:', error);
  }
}

// バックグラウンドメッセージの処理
messaging.onBackgroundMessage(async (payload) => {
  console.log("バックグラウンドで受信したメッセージ:", payload);

  const messageId = getMessageId(payload);
  if (!messageId) {
    console.warn('メッセージIDが取得できませんでした。処理をスキップします。');
    return;
  }

  // 重複チェック
  const isProcessed = await checkIfMessageProcessed(messageId);
  if (isProcessed) {
    console.log("すでに処理済みのメッセージです：", messageId);
    return;
  }

  // メッセージを処理済みとしてマーク
  await saveProcessedMessageId(messageId);

  // 通知を表示
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/logo.png",
    tag: messageId, // 同じtagの通知は上書きされる
  };

  await self.registration.showNotification(notificationTitle, notificationOptions);
});

