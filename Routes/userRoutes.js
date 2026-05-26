import express from 'express';
import { changePassword,
        verifyForgotPasswordCode,
        forgotPassword, resetPassword,
        sendVerificationCode, signIn,
        signOut, signUp,
        verifyVerificationCode } 
        from '../controllers/authController.js';
import { identifier } from '../middlewares/identifier.js';

export const router=express.Router();

router.post('/signUp',signUp);
router.post('/sendVerificationCode',sendVerificationCode);
router.post('/verifyVerification',verifyVerificationCode);
router.post('/signIn',signIn);
router.post('/signOut',identifier,signOut);
router.post('/changePassword',identifier,changePassword);
router.post('/forgotPassword',forgotPassword);
router.post('/verifyForgotPassword',verifyForgotPasswordCode);
router.post('/resetPassword',resetPassword);
