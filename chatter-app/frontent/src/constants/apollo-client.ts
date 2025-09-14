import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  CombinedGraphQLErrors,
  ServerError,
} from '@apollo/client';
import { API_URL } from './urls';
import { ErrorLink } from '@apollo/client/link/error';
import PUBLIC_ROUTES from './public-routes';
import { onLogout } from '../utils/logout';

// GraphQL 엔드포인트 URL 설정
const GRAPHQL_URI = `${API_URL}/graphql`;

// PUBLIC_ROUTES가 아니고 401 에러가 발생하면, /login 으로 리다이렉트
const publicLink = new ErrorLink(({ error }) => {
  // GraphQL 에러에서 UNAUTHENTICATED 확인
  if (CombinedGraphQLErrors.is(error)) {
    const hasUnauthorizedError = error.errors.some(
      (err) => err.extensions?.code === 'UNAUTHENTICATED',
    );

    if (hasUnauthorizedError) {
      const currentPath = window.location.pathname;

      // 현재 경로가 PUBLIC_ROUTES에 포함되지 않은 경우에만 리다이렉트
      if (!PUBLIC_ROUTES.includes(currentPath)) {
        console.log('UNAUTHENTICATED 에러 발생, 로그인 페이지로 리다이렉트');
        onLogout();
      }
    }
  }

  // Server 에러에서 401 상태 코드 확인
  if (ServerError.is(error) && error.statusCode === 401) {
    const currentPath = window.location.pathname;

    // 현재 경로가 PUBLIC_ROUTES에 포함되지 않은 경우에만 리다이렉트
    if (!PUBLIC_ROUTES.includes(currentPath)) {
      console.log('401 상태 코드 에러 발생, 로그인 페이지로 리다이렉트');
      window.location.href = '/login';
    }
  }
});

// HttpLink로 네트워크 연결 설정
const httpLink = new HttpLink({
  uri: GRAPHQL_URI,
  credentials: 'include', // 쿠키 및 인증 정보 포함
  headers: {
    'Content-Type': 'application/json',
  },
});

// InMemoryCache 설정 (최신 권장 옵션 포함)
const cache = new InMemoryCache({
  // Apollo Client 4.x에서 권장되는 설정
  typePolicies: {
    // 필요시 타입별 캐시 정책 설정
  },
});

// Apollo Client 인스턴스 생성 (최신 문법)
const client = new ApolloClient({
  link: publicLink.concat(httpLink),
  cache,
  // 개발 환경에서 DevTools 연결
  devtools: {
    enabled: import.meta.env.NODE_ENV === 'development',
  },
  // 기본 쿼리 옵션 설정
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'cache-first',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

export default client;
