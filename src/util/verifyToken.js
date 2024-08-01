import jwt from "jsonwebtoken"

const verifyToken = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization;
        console.log(authorization)
        const token = authorization.split(" ")[1];
        console.log(token);
        if(!token) {
            return res.status(400).json({message: "Invalid token"})
        }

        jwt.verify(token, "GUNNER1234", (err, decoded) => {
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