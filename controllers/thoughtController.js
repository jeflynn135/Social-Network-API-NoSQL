const { Thought, User } = require('../models');

module.exports = {
  // Get all thoughts
  async getAllThoughts(req, res) {
    try {
      const thought = await Thought.find().sort({ createdAt: -1 });

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Get a single thought
  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId })

      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Create a thought
  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);

      const user = await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $push: { thoughts: thought._id } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: 'Thought created but no user with this ID!' });
      }

      res.json(thought);
    } catch (err) {
      console.log(err);
       res.status(500).json(err);
    }
  },
    // Update a thought
  async updateThought(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!thought) {
       return res.status(404).json({ message: 'No thought with this id!' });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  
  // Delete a thought
  async removeThought(req, res) {
    try {
      const thought = await Thought.findOneAndDelete(
        { _id: req.params.thoughtId }
    );

      if (!thought) {
       return res.status(404).json({ message: 'No course with that ID' });
      }

      const user = User.findOneAndUpdate(
        { thoughts: req.params.thoughtId },
        { $pull: { thoughts: req.params.thoughtId } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: 'No user with this id!' });
      }

      res.json({ message: 'Thought deleted!' });
    } catch (err) {
      res.status(500).json(err);
    }
  },
// add reaction to thought
async addReaction(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      );

      if (!thought) {
        return res.status(404).json({ message: 'No thought with this id!' });
      }
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
      // Delete a reaction
      async removeReaction(req, res) {
        try {
          const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { runValidators: true, new: true }
        );
    
          if (!thought) {
            return res.status(404).json({ message: 'No thought with that ID' });
          }
    
          res.json(thought)
        } catch (err) {
          res.status(500).json(err);
        }
      },
  };
