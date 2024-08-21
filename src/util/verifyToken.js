import jwt from "jsonwebtoken";
import "dotenv/config";
const verifyToken = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization;
        console.log(authorization);
        const token = authorization.split(" ")[1];
        if(!token) {
            return res.status(400).json({message: "Invalid token"})
        }

        jwt.verify(token, process.env.SECRET, (err, decoded) => {
            if(err) {
                return res.status(401).json({message: "Invalid token"})
            }
            req.userId = decoded.userId;
            next();
        })
    }catch(err) {
        throw new Error("Error: " + err.message);
    }
}

export default verifyToken;