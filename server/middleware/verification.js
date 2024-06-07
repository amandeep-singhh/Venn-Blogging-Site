import jwt from 'jsonwebtoken';
import 'dotenv/config'

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) {
        return res.status(401).json({ error: "No Access Token" })
    }
    jwt.verify(token, process.env.SECRET_ACCESS_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ error: "Access Token is invalid" });
        }
        req.user = user.id;
        next();

    })
}

export { verifyJWT }