const { User, Thought } = require('../models');

module.exports = {
    // Get all users
    async getAllUsers(req, res) {
      try {
        const user = await User.find()
        .select('-__v')

        res.json(user);
      } catch (err) {
        res.status(500).json(err);
      }
    },
    // Get a single user
    async getSingleUser(req, res) {
      try {
        const user = await User.findOne({ _id: req.params.userId })
          .select('-__v')
          .populate('friends')
          .populate('thoughts');
  
        if (!user) {
          return res.status(404).json({ message: 'No user with that ID' });
        }
  
        res.json(user);
      } catch (err) {
        console.log(err)
        res.status(500).json(err);
      }
    },
    // create a new user
    async createUser(req, res) {
      try {
        const user = await User.create(req.body);
        res.json(user);
      } catch (err) {
        res.status(500).json(err);
      }
    },
    // Update user
  async updateUser(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!user) {
        return res.status(404).json({ message: 'No user with this id!' });
      }

      res.json(user);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
    // Delete user and associated thoughts
    async removeUser(req, res) {
      try {
        const user = await User.findOneAndDelete({ _id: req.params.userId });
  
        if (!user) {
          return res.status(404).json({ message: 'No user with that ID' });
        }
  
        await Thought.deleteMany({ _id: { $in: user.thoughts } });
        res.json({ message: 'User and associated thoughts deleted!' })
      } catch (err) {
        res.status(500).json(err);
      }
    },
  // add friend to friend list
  async addFriend(req, res) {
    try {
      const user = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: req.params.friendId }},
            { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
      // Remove friend from list 
      async removeFriend(req, res) {
        try {
          const user = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId }},
            { new: true }
        );
    
          if (!user) {
            return res.status(404).json({ message: 'No user with that ID' });
          }
    
          res.json(user)
        } catch (err) {
          res.status(500).json(err);
        }
      },
  };