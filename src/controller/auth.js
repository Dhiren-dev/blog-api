import User from "../model/User.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import generateTokenAndSetCookie from "../util/generateToken.js";


const defaultImgUrl = "../../public/default.png";

const check = async (req, res) => {
  const authToken = req.cookies.authToken;
  if (!authToken) {
    return res.status(401).json({ message: 'No authToken cookie found' });
  }
  try {
    res.status(200).json({authToken: authToken});
  } catch (err) {
    return res.status(401).json({ message: 'Invalid authToken' });
  }
};

const signUp = async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;

    if (!username || !email || !password || !fullName) {
      return res.status(400).json({ message: "Please fill all the required field" });
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      const message =
        existingUser.username === username
          ? "Username already taken"
          : "Email already exists";
      return res.status(400).json({ message });
    }

    console.log(password);
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      fullName,
    });
    await newUser.save();
    console.log(newUser);
    return res.status(201).json({ message: "User created successfully!" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Unable to sign up. Please try again later " + err });
  }
};

const logIn = async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;
    console.log(usernameOrEmail);
    if (!usernameOrEmail || !password) {
      return res.status(400).json({ message: "All the fields are required" });
    }

    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });

    console.log(user);

    if (!user) {
      return res.status(401).json({ message: "Invalid username or email" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = await generateTokenAndSetCookie(user, res);
    console.log("token",token);
    return res.status(200).json({ message: "Logged in successfully!" });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error " + err });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.passwordReset = {
      token: resetToken,
      expires: Date.now() + 3600000,
    };
    await user.save();

    await sendResetPasswordEmail(email, resetToken, req);

    return res.status(200).json({ message: "Reset password email sent" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const token = req.params.token;
    const { newPassword } = req.body;

    const user = await User.findOne({
      "passwordReset.token": token,
      "passwordReset.expires": { $gt: Date.now() },
    });

    if (!user) {
      return res.status(404).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.passwordReset = {
      token: null,
      expires: null,
    };
    await user.save();
    return res.status(200).json({ message: "Password reset successfully" });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const logOut = (req, res) => {
  try {
    res
      .clearCookie("authtoken", { path: "/", sameSite: true })
      .status(200)
      .json({ message: "Logged out successfully!" });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" + err });
  }
};

export default { signUp, logIn, logOut, forgotPassword, resetPassword , check};
