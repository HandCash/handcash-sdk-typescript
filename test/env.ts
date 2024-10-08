/* c8 ignore start */
import * as dotenv from 'dotenv';

dotenv.config();

function getEnvString(envVarName: string, fallback?: string): string {
	const result = process.env[envVarName]?.trim();
	if (fallback === undefined && !result) throw new Error(`Missing required environment variable: ${envVarName}`);
	return (result || fallback) as string;
}

export const handcashAppId = getEnvString('test_app_id');
export const handcashAppSecret = getEnvString('test_app_secret');
export const authToken = getEnvString('test_auth_token');
/* c8 ignore end */
