// ===========================================
// Apollo Client 설정 - GraphQL 클라이언트 구성
// ===========================================

import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  CombinedGraphQLErrors,
  ServerError,
  ApolloLink,
} from '@apollo/client';
import { API_URL, WS_URL } from './urls';
import { ErrorLink } from '@apollo/client/link/error';
import PUBLIC_ROUTES from './public-routes';
import { onLogout } from '../utils/logout';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';

// ===========================================
// 1. 기본 URL 설정
// ===========================================
const GRAPHQL_URI = `${API_URL}/graphql`; // HTTP GraphQL 엔드포인트

// ===========================================
// 2. 에러 처리 링크 - 인증 실패 시 자동 리다이렉트
// ===========================================
const publicLink = new ErrorLink(({ error }) => {
  // GraphQL 에러 처리: UNAUTHENTICATED 코드 감지
  if (CombinedGraphQLErrors.is(error)) {
    const hasUnauthorizedError = error.errors.some(
      (err) => err.extensions?.code === 'UNAUTHENTICATED',
    );

    if (hasUnauthorizedError) {
      const currentPath = window.location.pathname;

      // 보호된 페이지에서만 리다이렉트 실행
      if (!PUBLIC_ROUTES.includes(currentPath)) {
        console.log('UNAUTHENTICATED 에러 발생, 로그인 페이지로 리다이렉트');
        onLogout(); // 토큰 제거 및 리다이렉트
      }
    }
  }

  // HTTP 상태 코드 에러 처리: 401 Unauthorized
  if (ServerError.is(error) && error.statusCode === 401) {
    const currentPath = window.location.pathname;

    if (!PUBLIC_ROUTES.includes(currentPath)) {
      console.log('401 상태 코드 에러 발생, 로그인 페이지로 리다이렉트');
      window.location.href = '/login';
    }
  }
});

// ===========================================
// 3. HTTP 링크 - Query/Mutation 처리
// ===========================================
const httpLink = new HttpLink({
  uri: GRAPHQL_URI,
  credentials: 'include', // 쿠키 기반 인증 정보 자동 포함
  headers: {
    'Content-Type': 'application/json',
  },
});

// ===========================================
// 4. WebSocket 링크 - Subscription 처리
// ===========================================
const wsLink = new GraphQLWsLink(
  createClient({
    url: WS_URL, // WebSocket GraphQL 엔드포인트
    // connectionParams: () => ({
    //   // WebSocket 연결 시 인증 정보 (필요시 추가)
    //   authorization: `Bearer ${getToken()}`,
    // }),
  }),
);

// ===========================================
// 5. 스플릿 링크 - 요청 타입별 프로토콜 분기
// ===========================================
const splitLink = ApolloLink.split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    // Subscription 여부 판단
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink, // Subscription → WebSocket 프로토콜
  httpLink, // Query/Mutation → HTTP 프로토콜
);

// ===========================================
// 6. 캐시 설정 - 클라이언트 사이드 데이터 관리
// ===========================================
const cache = new InMemoryCache({
  typePolicies: {
    // 타입별 캐시 정책 (필요시 설정)
    // Message: {
    //   fields: {
    //     // 메시지 리스트 캐시 정책 등
    //   }
    // }
    Query: {
      fields: {
        chats: {
          keyArgs: false,
          merge: (existing, incoming, { args }: any) => {
            const merged = existing ? existing.slice(0) : [];
            for (let i = 0; i < incoming.length; i++) {
              merged[args.skip + i] = incoming[i];
            }
            return merged;
          },
        },
        messages: {
          keyArgs: ['chatId'],
          merge: (existing, incoming, { args }: any) => {
            const merged = existing ? existing.slice(0) : [];
            for (let i = 0; i < incoming.length; i++) {
              merged[args.skip + i] = incoming[i];
            }
            return merged;
          },
        },
      },
    },
  },
});

// ===========================================
// 7. Apollo Client 인스턴스 생성
// ===========================================
const client = new ApolloClient({
  // 링크 체인: ErrorLink → SplitLink (WS/HTTP)
  link: publicLink.concat(splitLink),
  cache,
  // 개발 도구 연결
  devtools: {
    enabled: import.meta.env.NODE_ENV === 'development',
  },
  // 기본 쿼리 정책
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network', // 캐시 우선, 네트워크로 업데이트
      errorPolicy: 'all', // 에러 발생 시에도 부분 데이터 반환
    },
    query: {
      fetchPolicy: 'cache-first', // 캐시 우선
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all', // Mutation 에러 시에도 결과 반환
    },
  },
});

export default client;
