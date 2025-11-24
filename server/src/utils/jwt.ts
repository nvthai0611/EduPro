const { JWT_SECRET, JWT_EXPIRES ,JWT_EXPIRE_REFRESH} = process.env
import { sign, verify } from 'jsonwebtoken';
export async function createAccessToken(data) {
    return sign(data, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}
export async function verifyToken(token) {
    return verify(token, JWT_SECRET);
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