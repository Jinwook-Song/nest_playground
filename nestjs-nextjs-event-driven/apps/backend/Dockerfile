FROM node:18-alpine

WORKDIR /app

# 패키지 파일 복사
COPY package*.json ./

# 개발 의존성을 포함한 설치 (개발 환경이므로)
RUN npm install

# 소스 코드 복사
COPY . .

# 포트 노출
EXPOSE 3000

# 개발 서버 시작
CMD ["npm", "run", "dev"]
