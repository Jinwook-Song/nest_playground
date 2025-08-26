'use client';

import { useState } from 'react';
import { useEvents } from './events/useEvents';

export default function Home() {
  const [message, setMessage] = useState('이벤트를 기다리는 중...');
  const [isLoading, setIsLoading] = useState(false);

  useEvents(['snapshots.generated'], (eventType) => {
    console.log(`✅ [${eventType}] event received`);
    setMessage(
      `✅ 이벤트 수신됨: ${eventType} (${new Date().toLocaleTimeString()})`,
    );
  });

  const createAccount = async () => {
    setIsLoading(true);
    setMessage('계정 생성 중...');

    try {
      const response = await fetch('/api/accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `테스트사용자_${Date.now()}`,
          balance: Math.floor(Math.random() * 1000000),
        }),
      });

      if (response.ok) {
        const account = await response.json();
        setMessage(
          `계정 생성 완료: ${account.name} (잔액: ${account.balance.toLocaleString()}원)`,
        );
        console.log('✅ 계정 생성 성공:', account);
      } else {
        const errorText = await response.text();
        console.error('❌ 서버 응답 에러:', errorText);
        throw new Error(
          `계정 생성 실패: ${response.status} ${response.statusText}`,
        );
      }
    } catch (error) {
      console.error('❌ 계정 생성 에러:', error);
      setMessage('❌ 계정 생성 실패');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🚀 NestJS + Next.js 실시간 이벤트 테스트</h1>

      <div
        style={{
          margin: '20px 0',
          padding: '15px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
        }}
      >
        <h3>📡 실시간 이벤트 상태</h3>
        <p
          style={{
            color: message.includes('✅')
              ? 'green'
              : message.includes('❌')
                ? 'red'
                : 'orange',
          }}
        >
          {message}
        </p>
      </div>

      <button
        onClick={createAccount}
        disabled={isLoading}
        style={{
          padding: '12px 24px',
          fontSize: '16px',
          backgroundColor: isLoading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
        }}
      >
        {isLoading ? '처리 중...' : '🏦 새 계정 생성 (이벤트 테스트)'}
      </button>

      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <h4>🔍 동작 순서:</h4>
        <ol>
          <li>위 버튼을 클릭하면 계정이 생성됩니다</li>
          <li>백엔드에서 스냅샷 생성 작업이 시작됩니다</li>
          <li>Redis Pub/Sub을 통해 이벤트가 전파됩니다</li>
          <li>SSE를 통해 실시간으로 완료 알림을 받습니다</li>
          <li>위의 상태 메시지가 업데이트됩니다</li>
        </ol>
        <p>
          <strong>💡 Tip:</strong> 개발자 도구 Console에서도 로그를 확인할 수
          있습니다!
        </p>
      </div>
    </div>
  );
}
