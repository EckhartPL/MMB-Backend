import * as crypto from 'crypto';

export const hashPwd = (p: string) => {
  const hmac = crypto.createHmac('sha512', process.env.HASH_PWD);
  hmac.update(p);
  return hmac.digest('hex');
};
