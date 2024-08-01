import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = async (user, res) => {
  try {
    const token = await generateToken(user);
    res.cookie("authtoken", token, {
      expires: new Date(Date.now() + 1000 * 86400 * 2),
      sameSite: true,
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
      "GUNNER1234",
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
