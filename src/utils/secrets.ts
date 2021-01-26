import * as dotenv from 'dotenv';
import * as fs from 'fs';
import logger from './logger';

if (fs.existsSync('.env')) {
  logger.debug(
    'Secrets: Using .env file to supply config environment variables'
  );
  dotenv.config({path: '.env'});
} else {
  logger.debug(
    'Secrets: Using .env.example file to supply config environment variables'
  );
  dotenv.config({path: '.env.example'}); // you can delete this after you create your own .env file!
}

export const ENVIRONMENT = process.env.NODE_ENV;
export const prod = ENVIRONMENT === 'production'; // Anything else is treated as 'dev'
export const CLIENT_PATH = process.env['CLIENT_PATH'];
if (!CLIENT_PATH) {
  logger.error('Secrets: No client path was provided');
}

export const GITHUB_TOKEN = process.env['GITHUB_TOKEN'];

if (!GITHUB_TOKEN) {
  logger.error('Secrets: No Github token provided.');
  // eslint-disable-next-line no-process-exit
  process.exit(1);
}

export const CRED_SALT = process.env['CRED_SALT'];

if (!CRED_SALT) {
  logger.error('Secrets: No salt was provided for credentials provided.');
  // eslint-disable-next-line no-process-exit
  process.exit(1);
}
