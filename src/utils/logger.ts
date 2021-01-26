import {LoggerOptions} from 'winston';

const winston = require('winston');

class TimestampFirst {
  private enabled: boolean;
  constructor(enabled = true) {
    this.enabled = enabled;
  }
  transform(obj: any) {
    if (this.enabled) {
      return Object.assign(
        {
          timestamp: obj.timestamp,
        },
        obj
      );
    }
    return obj;
  }
}

const enumerateErrorFormat = winston.format((info: any) => {
  if (info.message instanceof Error) {
    info.message = Object.assign(
      {
        message: info.message.message,
        stack: info.message.stack,
      },
      info.message
    );
  }

  if (info instanceof Error) {
    return Object.assign(
      {
        message: info.message,
        stack: info.stack,
      },
      info
    );
  }

  return info;
});

const myFormat = winston.format.combine(
  enumerateErrorFormat(),
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss.SSS',
  }),
  new TimestampFirst(true),
  winston.format.json()
);

const options: LoggerOptions = {
  transports: [
    new winston.transports.Console({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    }),
    new winston.transports.File({filename: 'debug.log', level: 'debug'}),
  ],
  format: myFormat,
};

const logger = winston.createLogger();
logger.configure(options);

if (process.env.NODE_ENV !== 'production') {
  logger.debug('Logging initialized at debug level');
}

if (process.env.NODE_ENV === 'test') {
  logger.debug(
    'Testing environment detected. Bringing log level down to error.'
  );
  logger.transports.forEach((item: {level: string}) => (item.level = 'error'));
}

export default logger;
