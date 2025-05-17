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
  const timestamp = new Date().toLocaleTimeString();
  console.log(`===== 通知受信 [${timestamp}] =====`);
  console.log("ペイロード全体:", payload);
  console.log("通知内容:", payload.notification);
  console.log("データ:", payload.data);

  // メッセージIDの取得とログ出力
  const messageId = getMessageId(payload);
  console.log("生成されたメッセージID:", messageId);
  
  if (!messageId) {
    console.warn('メッセージIDが取得できませんでした。処理をスキップします。');
    return;
  }

  // 重複チェック
  console.log("キャッシュで重複チェック中...");
  const isProcessed = await checkIfMessageProcessed(messageId);
  
  if (isProcessed) {
    console.log("キャッシュチェック結果: すでに処理済みのメッセージです");
    console.log(`===== 通知スキップ完了 [${new Date().toLocaleTimeString()}] =====`);
    return;
  }
  console.log("キャッシュチェック結果: 新規メッセージです");

  // メッセージを処理済みとしてマーク
  console.log("メッセージをキャッシュに保存中...");
  await saveProcessedMessageId(messageId);
  console.log("メッセージを処理済みとしてキャッシュに保存しました");

  // 通知を表示
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/logo.png",
    tag: messageId, // 同じtagの通知は上書きされる
    data: {
      messageId: messageId,
      timestamp: Date.now(),
      payloadData: payload.data
    }
  };

  console.log("通知を表示します:", { タイトル: notificationTitle, オプション: notificationOptions });
  try {
    await self.registration.showNotification(notificationTitle, notificationOptions);
    console.log("通知の表示に成功しました");
  } catch (error) {
    console.error("通知の表示中にエラーが発生しました:", error);
  }
  
  console.log(`===== 通知表示完了 [${new Date().toLocaleTimeString()}] =====`);
});

