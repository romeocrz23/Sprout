const express = require('express');
const NotesController = require('../controllers/notes.controller');

const router = express.Router();

/**
 * @route GET api/notes/:id
 * @desc Get existing notes by ID
 * @access Private
 */
router.get("/:id", NotesController.getNote);

/**
 * @route POST api/notes
 * @desc Create new note
 * @access Private
 */
router.post("/", NotesController.addNote);

/**
 * @route DELETE api/notes/:id
 * @desc Delete note by ID
 * @access Private
 */
router.delete("/:id", NotesController.deleteNote);

/**
 * @route UPDATE api/user/:id
 * @desc Edit an existing note by ID
 * @access Private
 */
router.put("/:id", NotesController.editNote);

module.exports = router;