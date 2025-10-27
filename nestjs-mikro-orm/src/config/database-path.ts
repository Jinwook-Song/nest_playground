import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';

export function getDatabasePath(): string {
  const appName = process.env.APP_NAME || 'MyApp';

  // 개발 환경: 프로젝트 루트
  if (process.env.NODE_ENV !== 'production') {
    return process.env.DB_PATH || './database.db';
  }

  // 프로덕션: OS별 표준 경로
  const platform = os.platform();
  let dbDir: string;

  switch (platform) {
    case 'darwin': // macOS
      dbDir = path.join(
        os.homedir(),
        'Library',
        'Application Support',
        appName,
      );
      break;

    case 'win32': // Windows
      dbDir = path.join(process.env.APPDATA || os.homedir(), appName);
      break;

    case 'linux':
      dbDir = path.join(os.homedir(), '.config', appName);
      // 또는: path.join(os.homedir(), '.local', 'share', appName);
      break;

    default:
      // Fallback
      dbDir = path.join(os.homedir(), `.${appName}`);
  }

  // 디렉토리가 없으면 생성
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  return path.join(dbDir, 'database.db');
}
