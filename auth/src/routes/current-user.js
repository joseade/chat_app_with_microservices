const express = require("express");
const jwt = require("jsonwebtoken");

const currentUser = require("../middlewares/current-user");
const requireAuth = require("../middlewares/require-auth");

const User = require("../models/user");
const BadRequestError = require("../errors/bad-request-error");

const router = express.Router();

router.get("/users/currentuser", currentUser, requireAuth, async (req, res) => {
  const user = await User.findById(req.currentUser.id);
  res.send({ currentUser: user || null });
  // if (!req.session?.jwt) {
  //   return res.send({ currentUser: null });
  // }
  // try {
  //   const payload = jwt.verify(req.session.jwt, "America");
  //   return res.send({ currentUser: payload });
  // } catch (err) {
  //   return res.send({ currentUser: null });
  // }
});

router.post("/users/language", currentUser, requireAuth, async (req, res) => {
  const user = await User.findById(req.currentUser.id);
  await user.updateOne({ language: req.body.language });
  const { language } = await User.findById(req.currentUser.id);

  res.status(200).json({ language });
});

router.get("/users/picture", currentUser, requireAuth, async (req, res) => {
  const user = await User.findById(req.currentUser.id);
  res.status(200).json(user.profilePicture);
});

router.post("/users/picture", currentUser, requireAuth, async (req, res) => {
  const user = await User.findById(req.currentUser.id);
  await user.updateOne({
    $set: { profilePicture: req.body.profilePicture },
  });
  const x = await User.find({
    followers: { $elemMatch: { id: req.currentUser.id } },
  });

  x.forEach(async (user) => {
    const query = {
      _id: user._id,
      "followers.id": req.currentUser.id,
    };
    const updateFollowers = {
      $set: { "followers.$.profilePicture": req.body.profilePicture },
    };
    const updateFollowings = {
      $set: { "followings.$.profilePicture": req.body.profilePicture },
    };
    await User.updateOne(query, updateFollowers);
    await User.updateOne(query, updateFollowings);
  });

  // const user = await User.findByIdAndUpdate(req.currentUser.id, {
  //   $set: { profilePicture: req.body.profilePicture },
  // });
  res.status(200).json({ profilePicture: req.body.profilePicture });
});

router.get("/users/:email", async (req, res) => {
  const email = req.params.email;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const { password, name, email, _id } = existingUser;
    res.status(201).json({ name, email, id: _id });
  } else {
    throw new BadRequestError("The user does not exists");
  }
});

router.post("/users/:id/follow", async (req, res) => {
  const user = await User.findById(req.params.id);
  const currentUser = await User.findById(req.body.userId);

  if (!user.followers.includes(req.body.userId)) {
    await user.updateOne({
      $push: {
        followers: {
          id: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
          profilePicture: currentUser.profilePicture,
        },
      },
    });
    await currentUser.updateOne({
      $push: {
        followings: {
          id: user.id,
          name: user.name,
          email: user.email,
          profilePicture: user.profilePicture,
        },
      },
    });
    //await user.updateOne({ $push: { followers: req.body.userId } });
    //await currentUser.updateOne({ $push: { followings: req.params.id } });
    //res.status(200).json("user has been followed");
    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
    });
  } else {
    res.status(403).json("you allready follow this user");
  }
});

router.get("/users/:id/followers", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    const { followers } = user;
    res.status(201).send(followers);
  } else {
    throw new BadRequestError("The user does not exists");
  }
});

router.get("/users/:id/friends", async (req, res) => {
  const friends = await User.aggregate([
    {
      $project: {
        friends: { $setIntersection: ["$followers", "$followings"] },
      },
    },
  ]);
  //console.log(friends);
  const f = friends.filter((user) => user._id == req.params.id);
  //console.log(f);
  if (f[0].friends !== null) {
    return res.status(201).send(f[0].friends);
  }

  res.status(201).send([]);
});

module.exports = router;
