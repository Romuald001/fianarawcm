const router = require('express').Router();
const { listApproved, createdPending, listPending, approve, reject } = require('../controllers/ToiletController');
const auth = require('../middlewares/auth');
const { requireRole } = require('../middlewares/roles');


// Public
router.get('/', listApproved);

// Auth user (proposer point)
router.post('/', auth, createdPending);

// Admin/Mod: (moderation)
router.get('/pending', auth, requireRole('moderator', 'admin'), listPending);
router.patch('/:id/approved', auth, requireRole('moderatore', 'admin'), approve);
router.patch('/:id/rejected', auth, requireRole('moderatore', 'admin'), reject);

module.exports = router;