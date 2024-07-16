const router = require('express').Router();
const {
  getAllUsers,
  getSingleUser,
  createUser,
  updateUser,
  removeUser,
  addFriend,
  removeFriend,
} = require('../../controllers/userController');

// /api/users
router.route('/').get(getAllUsers).post(createUser);

// /api/users/:userId
router.route('/:userId').get(getSingleUser).put(updateUser).delete(removeUser);

// /api/users/:userId/friends/:friendId
router.route('/:userId/friends/:friendId').post(addFriend).delete(removeFriend);

module.exports = router;