// Firebase Cloud Messaging Service Worker
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js"
);

// Firebaseの初期化
firebase.initializeApp({
  apiKey: "AIzaSyCQ_uI-RuoTzt0HE6-8Bdc1lsRpuAiyWRs",
  authDomain: "okusuri-fcm.firebaseapp.com",
  projectId: "okusuri-fcm",
  storageBucket: "okusuri-fcm.firebasestorage.app",
  messagingSenderId: "725863494",
  appId: "1:725863494:web:f812ecb4d5a8124a338e47",
  measurementId: "G-QGPNCZTBCL",
});

// Messagingのインスタンス取得
const messaging = firebase.messaging();

// 処理済みメッセージを追跡する変数 - indexedDBに保存
const dbName = "fcm_notification_db";
const storeName = "processed_messages";
const dbVersion = 1;

/**
 * IndexedDBデータベースを開く
 * @return {Promise<IDBDatabase>}
 */
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, dbVersion);

    request.onerror = (event) => {
      console.error("IndexedDBを開けませんでした:", event.target.error);
      reject(event.target.error);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      // 処理済みメッセージ用のオブジェクトストアを作成
      if (!db.objectStoreNames.contains(storeName)) {
        const store = db.createObjectStore(storeName, { keyPath: "id" });
        store.createIndex("timestamp", "timestamp", { unique: false });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
  });
}

/**
 * メッセージを処理済みとしてマークする
 * @param {string} messageId - メッセージID
 */
async function markMessageAsProcessed(messageId) {
  try {
    const db = await openDB();
    const transaction = db.transaction([storeName], "readwrite");
    const store = transaction.objectStore(storeName);

    // メッセージを処理済みとして保存
    const record = {
      id: messageId,
      timestamp: Date.now()
    };
    
    store.put(record);
    
    transaction.oncomplete = () => {
      console.log(`メッセージID ${messageId} を処理済みとして保存しました`);
      db.close();
      
      // 古いレコードのクリーンアップ
      cleanupOldRecords();
    };
    
    transaction.onerror = (event) => {
      console.error("処理済みメッセージの保存中にエラーが発生しました:", event.target.error);
      db.close();
    };
  } catch (error) {
    console.error("処理済みメッセージの保存中にエラーが発生しました:", error);
  }
}

/**
 * メッセージが処理済みかチェックする
 * @param {string} messageId - メッセージID
 * @return {Promise<boolean>}
 */
async function isMessageProcessed(messageId) {
  try {
    const db = await openDB();
    const transaction = db.transaction([storeName], "readonly");
    const store = transaction.objectStore(storeName);
    
    return new Promise((resolve) => {
      const request = store.get(messageId);
      
      request.onsuccess = (event) => {
        const result = !!event.target.result;
        console.log(`メッセージID ${messageId} の処理済みステータス: ${result ? '処理済み' : '未処理'}`);
        db.close();
        resolve(result);
      };
      
      request.onerror = (event) => {
        console.error("処理済みメッセージのチェック中にエラーが発生しました:", event.target.error);
        db.close();
        resolve(false); // エラー時は未処理として扱う
      };
    });
  } catch (error) {
    console.error("処理済みメッセージのチェック中にエラーが発生しました:", error);
    return false; // エラー時は未処理として扱う
  }
}

/**
 * 古い処理済みレコードをクリーンアップする（30分より古いもの）
 */
async function cleanupOldRecords() {
  try {
    const db = await openDB();
    const transaction = db.transaction([storeName], "readwrite");
    const store = transaction.objectStore(storeName);
    const index = store.index("timestamp");
    
    // 30分前のタイムスタンプ
    const thirtyMinutesAgo = Date.now() - (30 * 60 * 1000);
    
    const range = IDBKeyRange.upperBound(thirtyMinutesAgo);
    const request = index.openCursor(range);
    
    let deletedCount = 0;
    
    request.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        store.delete(cursor.primaryKey);
        deletedCount++;
        cursor.continue();
      } else if (deletedCount > 0) {
        console.log(`${deletedCount}件の古いメッセージレコードを削除しました`);
      }
    };
    
    transaction.oncomplete = () => {
      db.close();
    };
    
    transaction.onerror = (event) => {
      console.error("古いレコードのクリーンアップ中にエラーが発生しました:", event.target.error);
      db.close();
    };
  } catch (error) {
    console.error("古いレコードのクリーンアップ中にエラーが発生しました:", error);
  }
}

/**
 * 受信したメッセージからメッセージIDを取得
 * @param {Object} payload - 受信したメッセージペイロード
 * @return {string} メッセージID
 */
function getMessageId(payload) {
  // データにmessageIdが含まれている場合はそれを優先
  if (payload.data && payload.data.messageId) {
    return `data-${payload.data.messageId}`;
  }
  
  // FCMのメッセージIDを使用
  if (payload.messageId) {
    return `fcm-${payload.messageId}`;
  }
  
  // 最終手段: タイムスタンプと通知内容のハッシュ
  const notificationContent = payload.notification ? 
    `${payload.notification.title}-${payload.notification.body}` : 
    "unknown";
  
  return `fallback-${Date.now()}-${notificationContent}`;
}

// バックグラウンドメッセージの処理
messaging.onBackgroundMessage(async (payload) => {
  const receivedTime = new Date().toLocaleTimeString();
  console.log(`===== 通知受信 [${receivedTime}] =====`);
  console.log("受信したペイロード:", payload);
  
  // メッセージIDを取得
  const messageId = getMessageId(payload);
  console.log("メッセージID:", messageId);
  
  if (!messageId) {
    console.warn("メッセージIDの取得に失敗しました。通知をスキップします。");
    return;
  }
  
  // 重複チェック
  const processed = await isMessageProcessed(messageId);
  
  if (processed) {
    console.log(`メッセージID ${messageId} はすでに処理済みです。通知をスキップします。`);
    return;
  }
  
  // メッセージを処理済みとしてマーク
  await markMessageAsProcessed(messageId);
  
  // 通知を表示
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/logo.png",
    tag: messageId, // 同じタグの通知は上書きされる
    data: {
      messageId: messageId,
      timestamp: Date.now(),
      originalData: payload.data
    }
  };
  
  console.log("通知を表示します:", {
    title: notificationTitle,
    options: notificationOptions
  });
  
  try {
    await self.registration.showNotification(notificationTitle, notificationOptions);
    console.log("通知の表示に成功しました");
  } catch (error) {
    console.error("通知の表示中にエラーが発生しました:", error);
  }
  
  console.log(`===== 通知表示完了 [${new Date().toLocaleTimeString()}] =====`);
});

// 通知がクリックされた時の処理
self.addEventListener('notificationclick', event => {
  console.log('通知がクリックされました:', event);
  
  // 通知を閉じる
  event.notification.close();
  
  // クライアントを開く/フォーカスする
  event.waitUntil(
    clients.matchAll({type: 'window'}).then(clientList => {
      // すでに開いているウィンドウがあれば、それにフォーカス
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      // 開いているウィンドウがなければ、新しいウィンドウを開く
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
