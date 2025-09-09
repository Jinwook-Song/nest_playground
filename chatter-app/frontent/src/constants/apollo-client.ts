import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { API_URL } from './urls';

// GraphQL 엔드포인트 URL 설정
const GRAPHQL_URI = `${API_URL}/graphql`;

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
  link: httpLink,
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
