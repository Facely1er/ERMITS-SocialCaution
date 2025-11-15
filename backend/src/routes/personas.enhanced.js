const express = require('express');
const router = express.Router();
const Persona = require('../models/Persona');
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const { asyncHandler } = require('../middleware/errorHandler.enhanced');
const { validate, schemas } = require('../middleware/validation');
const { cacheMiddleware, keyGenerators, invalidateCache } = require('../middleware/cache');

/**
 * @route   GET /api/personas
 * @desc    Get all active personas
 * @access  Public
 * @cache   1 hour
 */
router.get('/',
  cacheMiddleware(3600, keyGenerators.personas),
  asyncHandler(async (req, res) => {
    const personas = await Persona.find({ isActive: true })
      .select('-__v -createdAt -updatedAt')
      .sort({ displayName: 1 })
      .lean();

    res.json({
      success: true,
      count: personas.length,
      data: personas,
      cached: false
    });
  })
);

/**
 * @route   GET /api/personas/:name
 * @desc    Get a specific persona by name
 * @access  Public
 * @cache   1 hour
 */
router.get('/:name',
  cacheMiddleware(3600, keyGenerators.personaByName),
  asyncHandler(async (req, res) => {
    const persona = await Persona.findOne({
      name: req.params.name.toLowerCase().trim(),
      isActive: true
    }).select('-__v -createdAt -updatedAt').lean();

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
  })
);

/**
 * @route   POST /api/personas/select
 * @desc    Select a persona for the current user
 * @access  Private
 * @validation personaName required, must be valid persona
 */
router.post('/select',
  protect,
  validate(schemas.selectPersona, 'body'),
  asyncHandler(async (req, res) => {
    const { personaName } = req.body;

    // Verify persona exists
    const persona = await Persona.findOne({
      name: personaName,
      isActive: true
    }).lean();

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

    // Invalidate user's persona and cautions cache
    invalidateCache(`user:${req.user.id}:*`);

    res.json({
      success: true,
      message: 'Persona selected successfully',
      data: {
        user,
        persona
      }
    });
  })
);

/**
 * @route   GET /api/personas/user/current
 * @desc    Get current user's selected persona
 * @access  Private
 * @cache   5 minutes
 */
router.get('/user/current',
  protect,
  cacheMiddleware(300, keyGenerators.userPersona),
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select('selectedPersona').lean();

    if (!user || !user.selectedPersona) {
      return res.json({
        success: true,
        data: null,
        message: 'No persona selected'
      });
    }

    const persona = await Persona.findOne({
      name: user.selectedPersona,
      isActive: true
    }).select('-__v -createdAt -updatedAt').lean();

    if (!persona) {
      return res.json({
        success: true,
        data: null,
        message: 'Selected persona no longer available'
      });
    }

    res.json({
      success: true,
      data: persona
    });
  })
);

module.exports = router;
