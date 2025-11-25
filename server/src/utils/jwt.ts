const { JWT_SECRET, JWT_EXPIRES ,JWT_EXPIRE_REFRESH} = process.env
import { sign, verify, decode } from 'jsonwebtoken';

interface AccessTokenPayload {
  userId: string;
  role: string;
  image?: string;
}

export async function createAccessToken(data: AccessTokenPayload) {
    return sign(data, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

export async function verifyToken(token: string) {
    return verify(token, JWT_SECRET);
}

export async function decodeToken(token: string) {
    return decode(token);
}

export async function refreshAccessToken() {
    return sign(
        {
            data: Math.random() + new Date().getTime(),
        },
        JWT_SECRET,
        {
            expiresIn: JWT_EXPIRE_REFRESH,
        }
    );
}