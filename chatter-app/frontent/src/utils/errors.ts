// ApolloError 타입을 위한 인터페이스 정의
interface GraphQLError {
  message: string;
  extensions?: {
    code?: string;
    [key: string]: any;
  };
}

interface ApolloError {
  graphQLErrors?: GraphQLError[];
  networkError?: Error;
  message: string;
}

const extractErrorMessage = (error: unknown): string => {
  console.log(error);
  const apolloError = error as ApolloError;

  // ApolloError인지 확인하기 위해 graphQLErrors 또는 networkError 속성 존재 여부로 판단
  if (apolloError && (apolloError.graphQLErrors || apolloError.networkError)) {
    // GraphQL 에러 처리
    if (apolloError.graphQLErrors && apolloError.graphQLErrors.length > 0) {
      // 첫 번째 GraphQL 에러의 메시지 반환
      const firstGraphQLError = apolloError.graphQLErrors[0];

      // 확장 필드에서 사용자 정의 에러 메시지 확인
      if (firstGraphQLError.extensions?.code === 'BAD_USER_INPUT') {
        return firstGraphQLError.message || '입력 값이 올바르지 않습니다.';
      }

      // 일반 GraphQL 에러
      return firstGraphQLError.message || 'GraphQL 에러가 발생했습니다.';
    }

    // 네트워크 에러 처리
    if (apolloError.networkError) {
      // 네트워크 에러의 경우 구체적인 메시지 반환
      if (apolloError.networkError.message.includes('fetch')) {
        return '네트워크 연결을 확인해주세요.';
      }
      return (
        apolloError.networkError.message || '네트워크 에러가 발생했습니다.'
      );
    }

    // 일반 Apollo 에러
    return apolloError.message || '알 수 없는 에러가 발생했습니다.';
  }

  // 일반 JavaScript 에러
  if (error instanceof Error) {
    return error.message;
  }

  // 문자열 에러
  if (typeof error === 'string') {
    return error;
  }

  // 기타 알 수 없는 에러
  return '알 수 없는 에러가 발생했습니다.';
};

export { extractErrorMessage };
