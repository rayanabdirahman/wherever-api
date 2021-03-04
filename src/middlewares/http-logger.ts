import { default as Morgan } from 'morgan';
import chalk from 'chalk';

const morgan = Morgan((tokens, req, res): string => {
  const status = parseInt(tokens.status(req, res) as string);
  const statusColor =
    status >= 500
      ? 'red'
      : status >= 400
      ? 'yellow'
      : status >= 300
      ? 'cyan'
      : 'green';
  return chalk[statusColor](
    [
      '[api]:',
      tokens.date(req, res),
      `[${tokens.method(req, res)}]:`,
      tokens.url(req, res),
      tokens.status(req, res),
      tokens['user-agent'](req, res),
      '-',
      tokens['response-time'](req, res),
      'ms'
    ].join(' ')
  );
});

export default morgan;
