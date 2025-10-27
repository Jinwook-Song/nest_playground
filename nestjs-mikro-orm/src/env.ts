import * as dotenv from 'dotenv';
import * as path from 'path';

const envFile =
  process.env.NODE_ENV === 'production'
    ? '.env.production'
    : '.env.development';

dotenv.config({ path: path.resolve(process.cwd(), envFile) });

console.log('🔍 Environment loaded:');
console.log('  NODE_ENV:', process.env.NODE_ENV);
console.log('  APP_NAME:', process.env.APP_NAME);
