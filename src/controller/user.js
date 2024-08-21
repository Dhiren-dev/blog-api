import Post from "../model/Post.js";
import User from "../model/User.js";
import Comment from "../model/Comment.js";

const getUserProfileByUsername = async (req, res) => {
  try {
    const username = req.params.username;
    if(!username) {
      return res.status(404).json({message: "User not found"})
    }
    const user = await User.findOne(
      { username: username },
      { _id: 0, email: 0, password: 0, role: 0, __v: 0, createdAt: 0 }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({ user });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" + err});
  }
};

const getAuthenticatedUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findOne(
      { _id: userId },
      { _id: 0, password: 0, role: 0, __v: 0 }
    );
    return res.status(200).json({ user });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" + err});
  }
};

const updateAuthenticatedUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { username, fullName, bio, profilePicture } = req.body;

    const isUsernameAvailable = await checkUsernameAvailability(
      username,
      userId
    );

    if (!isUsernameAvailable) {
      return res.json({ message: "Username is not available" });
    }

    const user = await User.findByIdAndUpdate(
      { _id: userId },
      {
        username,
        fullName,
        bio,
        profilePicture,
      },
      { new: true, timestamps: { updatedAt: true } }
    );

    return res
      .status(200)
      .json({ message: "Profile updated successfully!", user});
  } catch (err) {
    return res.status(500).json({message: "Internal Server Error" + err})
  }
};

const checkUsernameAvailability = async (username, userId) => {
  const timeOut = 30000;
  const startTime = Date.now();

  while (true) {
    const isAvailabe = await isUsernameAvailableNow(username, userId);
    if (isAvailabe) {
      return true;
    }
    if (Date.now() - startTime >= timeOut) {
      return false;
    }
    await new Promise((res) => setTimeout(res, 1000));
  }
};

const isUsernameAvailableNow = async (username, userId) => {
  const pipeline = [
    {
      $match: { username: username },
    },
    {
      $project: { _id: 1 },
    },
  ];

  const users = await User.aggregate(pipeline);

  return (
    users.length === 0 ||
    users.some((user) => {
      if (user._id.toString() !== userId.toString()) {
        return false;
      }
    })
  );
};

const createPost = async (req, res) => {
  try {
    const userId = req.userId;
    const { title, content } = req.body;

    const post = await Post({
      title: title,
      content: content,
      author: userId,
    });
    await post.save();
    
    const user = await User.findById(userId, { _id: 1 });

    if (user.role === "user") {
      user.role = "author";
      await user.save();
    }
    return res.status(200).json({ userData: user, postData: post });
  } catch (err) {
    return res
      .status(400)
      .json({ message: "An error occurred while processing your request" + err});
  }
};

const updatePostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, content } = req.body;

    const updatedPost = await Post.findByIdAndUpdate(
      { _id: postId },
      {
        title: title,
        content: content,
      },
      {
        new: true,
        timestamps: {
          updatedAt: true,
        },
      }
    );

    return res
      .status(200)
      .json({ message: "Post updated successfully!", data: updatedPost });
  } catch (err) {
    return res.json({ message: err });
  }
};

const getPostById = async (req, res) => {
  try {
    const postId = req.params.id;
    if (!postId) return res.status(404).json({ message: "Not found" });
    const post = await Post.findById(postId);
    return res.status(200).json({post});

  } catch (err) {
    return res.status(400).json({message: "Internal Server Error" + err})
  }
};

const getAllPosts = async (req, res) => {
  try {
    const allPosts = await Post.find();
    return res.status(200).json({allPosts});
  } catch (err) {
    return res.status(401).json({ message: "Internal Server Error" + err });
  }
};

const addComment = async (req, res) => {
  try {
    const userId = req.userId;
    const postId = req.params.id;
    const { body, name } = req.body;

    const newComment = await Comment.create({
      body,
      name,
      postId: postId,
      userId: userId,
    });

    const populatedComment = await Comment.findById(newComment._id)
      .populate("userId", "_id")
      .populate("postId", "_id");

    return res.status(200).json({populatedComment});
  } catch (err) {
    return res.status(500).json({message: "Internal Server Error" + err})
  }
};

const getAllComments = async (req, res) => {
  try {
    const postId = req.params.id;
    const comments = await Comment.find({ postId });
    return res.status(200).json({comments});
  } catch (err) {
    return res.status(500).json({message: "Internal Server Error" + err})
  }
};

const getCommentById = async (req, res) => {
  try {
    const userId = req.userId;
    const { commentId, postId } = req.params;

    const commentById = await Comment.find({ postId, _id: commentId, userId });

    return res.json({commentById});
  } catch (err) {
    return res.status(500).json({message: "Internal Server Error" + err})
  }
};

const editCommentById = async (req, res) => {
  try {
    const userId = req.userId;
    const { postId, commentId } = req.params;
    const { body } = req.body;

    const editedCommentByUser = await Comment.findOneAndUpdate(
      { _id: commentId, postId, userId },
      { body }
    );

    return res.json({editedCommentByUser});
  } catch (err) {
    return res.status(500).json({message: "Internal Server Error" + err})
  }
};

export default {
  addComment,
  getUserProfileByUsername,
  getAuthenticatedUserProfile,
  getAllComments,
  getAllPosts,
  updateAuthenticatedUserProfile,
  updatePostById,
  createPost,
  getPostById,
  getCommentById,
  editCommentById,
};
