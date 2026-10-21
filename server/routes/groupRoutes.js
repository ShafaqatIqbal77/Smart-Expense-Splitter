// =====================================================================
// routes/groupRoutes.js
// =====================================================================
//
// Router ek mini Express app hai — sirf routes ke liye.
// Yeh server.js mein import hoga aur /api/groups prefix ke saath use hoga.
//
// Matlab:
// router.get('/')    → actually /api/groups
// router.get('/:id') → actually /api/groups/:id
// =====================================================================

import express from 'express';
import {
  getAllGroups,
  getGroupById,
  createGroup,
  updateGroup,
  deleteGroup
} from '../controllers/groupController.js';

const router = express.Router();

// GET  /api/groups        → Sab groups
// POST /api/groups        → Naya group banao
router.route('/')
  .get(getAllGroups)
  .post(createGroup);

// GET    /api/groups/:id  → Ek group ki detail
// PUT    /api/groups/:id  → Group update karo
// DELETE /api/groups/:id  → Group delete karo
router.route('/:id')
  .get(getGroupById)
  .put(updateGroup)
  .delete(deleteGroup);

export default router;
