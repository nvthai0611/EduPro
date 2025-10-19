const { JWT_SECRET, JWT_EXPIRES ,JWT_EXPIRE_REFRESH} = process.env
const jwt = require('jsonwebtoken');
module.exports = {
    createAccessToken: async (data) => {
        return jwt.sign(data, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    },

    verifyToken: async (token) => {
        return jwt.verify(token, JWT_SECRET);
    },

    refreshAccessToken: async () => {
        return jwt.sign(
            {
                data: Math.random() + new Date().getTime(),
            },
            JWT_SECRET,
            {
                expiresIn: JWT_EXPIRE_REFRESH,
            }
        );
    }
}