'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { initializeMessaging, messaging } from '@/lib/firebase';
import {
  debugServiceWorker,
  unregisterAllServiceWorkers,
  resetFirebaseMessagingToken,
} from '@/utils/serviceWorkerDebug';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function DiagnosePage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [diagnosticResults, setDiagnosticResults] = useState<string | null>(
    null
  );

  const runDiagnostics = async () => {
    setIsLoading(true);
    setDiagnosticResults(null);

    try {
      console.clear(); // コンソールをクリアして読みやすくする

      // Firebase Messagingの初期化ステータスを確認
      const currentMessaging = await initializeMessaging();
      console.log(
        'Firebase Messagingのステータス:',
        currentMessaging ? '初期化完了' : '未初期化'
      );

      // サービスワーカーの診断
      await debugServiceWorker();

      // IndexedDBのデータベースを確認
      try {
        const databases = await window.indexedDB.databases();
        console.log('IndexedDBデータベース一覧:', databases);
      } catch (e) {
        console.log('IndexedDBデータベース一覧の取得に失敗:', e);
      }

      // キャッシュの確認
      try {
        const caches = await window.caches.keys();
        console.log('キャッシュ一覧:', caches);
      } catch (e) {
        console.log('キャッシュ一覧の取得に失敗:', e);
      }

      toast.success(
        '診断が完了しました。ブラウザのコンソールを確認してください'
      );
      setDiagnosticResults(
        '診断が完了しました。ブラウザのコンソールログを確認してください。'
      );
    } catch (error: any) {
      console.error('診断中にエラーが発生しました:', error);
      toast.error('診断中にエラーが発生しました');
      setDiagnosticResults(`エラー: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnregisterAll = async () => {
    setIsLoading(true);
    try {
      console.clear();
      const result = await unregisterAllServiceWorkers();
      if (result) {
        toast.success('すべてのサービスワーカーの登録解除に成功しました');
        setDiagnosticResults(
          '全てのサービスワーカーの登録解除に成功しました。ページを再読み込みしてください。'
        );
      } else {
        toast.error('一部のサービスワーカーの登録解除に失敗しました');
        setDiagnosticResults(
          '一部のサービスワーカーの登録解除に失敗しました。コンソールを確認してください。'
        );
      }
    } catch (error: any) {
      console.error('登録解除中にエラーが発生しました:', error);
      toast.error('登録解除中にエラーが発生しました');
      setDiagnosticResults(`エラー: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetToken = async () => {
    setIsLoading(true);
    try {
      console.clear();
      const newToken = await resetFirebaseMessagingToken(messaging);
      if (newToken) {
        toast.success('Firebase Messagingトークンのリセットに成功しました');
        setDiagnosticResults(
          `Firebase Messagingトークンのリセットに成功しました。新しいトークン: ${newToken.substring(
            0,
            10
          )}...`
        );
      } else {
        toast.error('トークンのリセットに失敗しました');
        setDiagnosticResults(
          'トークンのリセットに失敗しました。コンソールを確認してください。'
        );
      }
    } catch (error: any) {
      console.error('トークンリセット中にエラーが発生しました:', error);
      toast.error('トークンリセット中にエラーが発生しました');
      setDiagnosticResults(`エラー: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCleanupStorage = async () => {
    setIsLoading(true);
    try {
      console.clear();
      console.log('ブラウザのストレージをクリーンアップします...');

      // IndexedDBのクリーンアップ
      try {
        const databases = await window.indexedDB.databases();
        console.log('削除対象のIndexedDBデータベース:', databases);

        for (const db of databases) {
          if (
            db.name &&
            (db.name.includes('fcm') ||
              db.name.includes('firebase') ||
              db.name.includes('notification'))
          ) {
            console.log(`データベースを削除します: ${db.name}`);
            await window.indexedDB.deleteDatabase(db.name);
            console.log(`データベース ${db.name} を削除しました`);
          }
        }
      } catch (e) {
        console.error('IndexedDBのクリーンアップ中にエラー:', e);
      }

      // キャッシュのクリーンアップ
      try {
        const cacheKeys = await window.caches.keys();
        console.log('削除対象のキャッシュ:', cacheKeys);

        for (const key of cacheKeys) {
          if (
            key.includes('fcm') ||
            key.includes('firebase') ||
            key.includes('notification')
          ) {
            console.log(`キャッシュを削除します: ${key}`);
            await window.caches.delete(key);
            console.log(`キャッシュ ${key} を削除しました`);
          }
        }
      } catch (e) {
        console.error('キャッシュのクリーンアップ中にエラー:', e);
      }

      // ローカルストレージとセッションストレージのクリーンアップ
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (
            key &&
            (key.includes('fcm') ||
              key.includes('firebase') ||
              key.includes('notification'))
          ) {
            console.log(`ローカルストレージのアイテムを削除します: ${key}`);
            localStorage.removeItem(key);
          }
        }

        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (
            key &&
            (key.includes('fcm') ||
              key.includes('firebase') ||
              key.includes('notification'))
          ) {
            console.log(`セッションストレージのアイテムを削除します: ${key}`);
            sessionStorage.removeItem(key);
          }
        }
      } catch (e) {
        console.error('ストレージのクリーンアップ中にエラー:', e);
      }

      toast.success('ブラウザストレージのクリーンアップが完了しました');
      setDiagnosticResults(
        'ブラウザストレージのクリーンアップが完了しました。ページを再読み込みしてください。'
      );

      // 2秒後にページをリロード
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error: any) {
      console.error('ストレージクリーンアップ中にエラーが発生しました:', error);
      toast.error('ストレージクリーンアップ中にエラーが発生しました');
      setDiagnosticResults(`エラー: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testNotification = () => {
    if (!('Notification' in window)) {
      toast.error('このブラウザは通知をサポートしていません');
      return;
    }

    if (Notification.permission === 'granted') {
      const notification = new Notification('テスト通知', {
        body: 'これはブラウザからの直接のテスト通知です',
        icon: '/logo.png',
      });

      notification.onclick = () => {
        console.log('通知がクリックされました');
        window.focus();
        notification.close();
      };

      toast.success('テスト通知を送信しました');
    } else {
      toast.error('通知の権限がありません。通知設定から許可してください。');
    }
  };

  return (
    <div className='container max-w-md mx-auto pt-6 pb-24 px-4'>
      <Card className='overflow-hidden shadow-lg border-0 rounded-xl mb-6'>
        <CardHeader>
          <CardTitle className='text-lg'>通知診断ツール</CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div>
            <p className='text-sm text-muted-foreground mb-4'>
              このツールを使用して通知の問題を診断できます。
              各ボタンを順番に実行し、問題が解決するか確認してください。
            </p>
          </div>

          <div className='grid grid-cols-1 gap-4'>
            <Button
              variant='default'
              onClick={runDiagnostics}
              disabled={isLoading}
              className='w-full'
            >
              サービスワーカー診断を実行
            </Button>

            <Button
              variant='outline'
              onClick={handleUnregisterAll}
              disabled={isLoading}
              className='w-full'
            >
              全サービスワーカーを登録解除
            </Button>

            <Button
              variant='outline'
              onClick={handleResetToken}
              disabled={isLoading}
              className='w-full'
            >
              FCMトークンをリセット
            </Button>

            <Button
              variant='outline'
              onClick={handleCleanupStorage}
              disabled={isLoading}
              className='w-full'
            >
              全ストレージをクリーンアップ
            </Button>

            <Button
              variant='outline'
              onClick={testNotification}
              disabled={isLoading}
              className='w-full'
            >
              テスト通知を送信
            </Button>
          </div>

          {diagnosticResults && (
            <div className='p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-sm'>
              <p>{diagnosticResults}</p>
            </div>
          )}

          {isLoading && (
            <div className='flex justify-center'>
              <div className='animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full' />
            </div>
          )}
        </CardContent>
      </Card>

      <Card className='overflow-hidden shadow-lg border-0 rounded-xl'>
        <CardHeader>
          <CardTitle className='text-lg'>問題解決のヒント</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className='list-disc pl-5 space-y-2 text-sm'>
            <li>
              <strong>重複サービスワーカー</strong>:{' '}
              複数のサービスワーカーが登録されていると通知が重複することがあります。
            </li>
            <li>
              <strong>古いトークン</strong>:{' '}
              古いFCMトークンが残っていると同じデバイスに複数の通知が送信されることがあります。
            </li>
            <li>
              <strong>キャッシュの問題</strong>:{' '}
              ブラウザのキャッシュをクリアすると、問題が解決することがあります。
            </li>
            <li>
              <strong>最終手段</strong>:{' '}
              全ての手段を試しても解決しない場合は、ブラウザを変更してみてください。
            </li>
          </ul>

          <div className='mt-4 text-sm text-muted-foreground'>
            <p>
              これらの診断ツールを使用しても問題が解決しない場合は、
              サーバーログとブラウザログの両方を確認し、
              複数の通知が送信されていないか調べる必要があります。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
