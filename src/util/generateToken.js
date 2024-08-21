import jwt from "jsonwebtoken";
import "dotenv/config";

const generateTokenAndSetCookie = async (user, res) => {
  try {
    const token = await generateToken(user);
    console.log(token);
    res.cookie("authtoken", token, {
      expires: new Date(Date.now() + 1000 * 86400 * 2),
      sameSite: "Lax",
      // secure: true,
      // httpOnly: true,
    });
  } catch (err) {
    throw new Error(
      "Error generating token and setting cookie: " + err.message
    );
  }
};

const generateToken = async (user) => {
  return new Promise((res, rej) => {
    jwt.sign(
      { userId: user._id },
      process.env.SECRET,
      { expiresIn: "12h" },
      (err, token) => {
        if (err) {
          rej(err);
        } else {
          res(token);
        }
      }
    );
  });
};

export default generateTokenAndSetCookie;
