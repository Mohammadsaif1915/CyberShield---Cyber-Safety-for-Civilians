import express     from 'express'
import { protect } from '../middleware/auth.js'
import {
  createPaymentOrder,
  verifyPaymentAndIssue,
  getCertificate,
  getMyCertificates,
} from '../controllers/certificateController.js'

const router = express.Router()

router.get('/my',                        protect, getMyCertificates)
router.get('/:courseId',                 protect, getCertificate)
router.post('/:courseId/create-order',   protect, createPaymentOrder)
router.post('/:courseId/verify-payment', protect, verifyPaymentAndIssue)

export default router