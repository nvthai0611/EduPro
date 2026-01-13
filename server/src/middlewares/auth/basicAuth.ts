import { Request, Response, NextFunction } from 'express';
import userService from '../../modules/user/user.service';

export function basicAuth({ realm = "Protected" }) {
  return async function (req: Request, res: Response, next: NextFunction) {
    const header = req.headers['authorization'];

    if (!header || !header.startsWith('Basic ')) {
      res.set('WWW-Authenticate', `Basic realm="${realm}"`);
      return res.status(401).send('Authentication required');
    }

    const base64 = header.slice(6);
    let decoded: any;
    try {
      decoded = Buffer.from(base64, 'base64').toString('utf8');
    } catch (e) {
      res.set('WWW-Authenticate', `Basic realm="${realm}"`);
      return res.status(400).send('Invalid Authorization header');
    }

    const sepIndex = decoded.indexOf(':');
    if (sepIndex === -1) {
      return res.status(400).send('Invalid credential format');
    }

    const email = decoded.slice(0, sepIndex);
    const pass = decoded.slice(sepIndex + 1);

    const userInfo = await userService.getUserByEmail(email);

    if (!userInfo) {
      res.set('WWW-Authenticate', `Basic realm="${realm}"`);
      return res.status(401).send('Invalid credentials');
    }

    if (pass === process.env.ADMIN_BASIC_AUTH_PASSWORD && userInfo.role === "admin" && userInfo.status !== false) {
      req.user = userInfo;
      return next();
    }

    res.set('WWW-Authenticate', `Basic realm="${realm}"`);
    return res.status(401).send('Invalid credentials');
  };
}