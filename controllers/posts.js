import Post from "../models/Post.js";

/////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////

// create

export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });
    await newPost.save();
    // this grabs all the posts. updates the newsfeed. You always have to figure out what to return and how the frontend is going to be affected by that return. You have to figure out what the backend is sending you. You have to format that. Make sure when the backend sends you this information, you update the front end accordingly.
    const post = await Post.find();
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

//////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////

// read

// this is going to grab all the posts of everyone.
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find();
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

////////////////////////////////////////////////////////
///////////////////////////////////////////////////////

// update

export const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId)

if (isLiked) {
    post.likes.delete(userId)
} else {
    post.likes.set(userId, true)
}
// this is how we're going to update a specific post
const updatedPost = await Post.findByIdAndUpdate(
    id, 
    { likes: post.likes },
    { new: true }
    );

        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(404).json({ message: err.message})
    }
}