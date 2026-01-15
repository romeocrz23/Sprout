
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/User.controller');

// This file should be for user profile functionality AFTER login. Login functionality handled by auth controller //

/**
 * @route GET api/user/:id
 * @desc Get logged-in user information
 * @access Private
 */
router.get("/users/:id", UserController.getProfile);

/**
 * @route DELETE api/scheduler/items/:id
 * @desc Delete account
 * @access Private
 */
router.delete("/users/:id", UserController.deleteProfile);

/**
 * @route UPDATE api/scheduler/items/:id
 * @desc Update profile information
 * @access Private
 */
router.put("/users/:id", UserController.editProfile);

module.exports = router;