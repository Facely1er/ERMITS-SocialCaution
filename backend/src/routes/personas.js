const express = require('express');
const router = express.Router();
const Persona = require('../models/Persona');
const { protect } = require('../middleware/auth');
const User = require('../models/User');

/**
 * @route   GET /api/personas
 * @desc    Get all active personas
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const personas = await Persona.find({ isActive: true })
      .select('-__v')
      .sort({ displayName: 1 });

    res.json({
      success: true,
      count: personas.length,
      data: personas
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching personas',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/personas/:name
 * @desc    Get a specific persona by name
 * @access  Public
 */
router.get('/:name', async (req, res) => {
  try {
    const persona = await Persona.findOne({
      name: req.params.name,
      isActive: true
    });

    if (!persona) {
      return res.status(404).json({
        success: false,
        message: 'Persona not found'
      });
    }

    res.json({
      success: true,
      data: persona
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching persona',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/personas/select
 * @desc    Select a persona for the current user
 * @access  Private
 */
router.post('/select', protect, async (req, res) => {
  try {
    const { personaName } = req.body;

    if (!personaName) {
      return res.status(400).json({
        success: false,
        message: 'Persona name is required'
      });
    }

    // Verify persona exists
    const persona = await Persona.findOne({
      name: personaName,
      isActive: true
    });

    if (!persona) {
      return res.status(404).json({
        success: false,
        message: 'Persona not found'
      });
    }

    // Update user's selected persona
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { selectedPersona: personaName },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Persona selected successfully',
      data: {
        user,
        persona
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error selecting persona',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/personas/user/current
 * @desc    Get current user's selected persona
 * @access  Private
 */
router.get('/user/current', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user.selectedPersona) {
      return res.json({
        success: true,
        data: null,
        message: 'No persona selected'
      });
    }

    const persona = await Persona.findOne({
      name: user.selectedPersona,
      isActive: true
    });

    res.json({
      success: true,
      data: persona
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user persona',
      error: error.message
    });
  }
});

module.exports = router;
