import jwt from 'jsonwebtoken';

import { UserResult } from '@/entities/user';

import { token } from '../../config';

function createToken(user: UserResult) {
  return jwt.sign(user, token.secret, {
    expiresIn: token.expiresIn,
    issuer: token.issuer
  });
}

function decodeToken(t: string): Promise<UserResult> {
  return new Promise((resolve, reject) => {
    jwt.verify(t, token.secret, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      return resolve(decoded as UserResult);
    });
  });
}

export { createToken, decodeToken };
