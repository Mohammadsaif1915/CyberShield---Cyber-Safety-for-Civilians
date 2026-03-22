import express from 'express'
import { issueCertificate, getCertificate, getMyCertificates } from '../controllers/certificateController.js'

const router = express.Router()

router.get('/my',         getMyCertificates)
router.get('/:courseId',  getCertificate)
router.post('/:courseId', issueCertificate)

export default router