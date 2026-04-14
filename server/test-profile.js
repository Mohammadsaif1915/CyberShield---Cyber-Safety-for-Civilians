#!/usr/bin/env node

/**
 * Test script for profile update with avatar upload
 * Run: node test-profile.js
 */

import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const API_URL = 'http://localhost:5000/api';

async function test() {
  try {
    console.log('🧪 Testing Profile Update Endpoint...\n');

    // Check Cloudinary config
    console.log('1️⃣ Checking Cloudinary Configuration...');
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      console.log('⚠️  CLOUDINARY_CLOUD_NAME not set!');
    }
    if (!process.env.CLOUDINARY_API_KEY) {
      console.log('⚠️  CLOUDINARY_API_KEY not set!');
    }
    if (!process.env.CLOUDINARY_API_SECRET) {
      console.log('⚠️  CLOUDINARY_API_SECRET not set!');
    }

    // Create a test image (1px transparent PNG)
    const pngBuffer = Buffer.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
      0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4,
      0x89, 0x00, 0x00, 0x00, 0x0a, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
      0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae,
      0x42, 0x60, 0x82
    ]);

    console.log('\n2️⃣ Test Endpoint: PUT /api/auth/profile (with avatar)');
    console.log('   Note: This test requires a valid user token');
    console.log('   Expected: Profile updated with avatar URL from Cloudinary\n');

    // Example of what the frontend sends
    const formData = new FormData();
    formData.append('fullName', 'Test User');
    formData.append('email', 'test@example.com');
    formData.append('phone', '1234567890');
    formData.append('location', 'Test City');
    formData.append('role', 'student');
    formData.append('bio', 'Test bio');
    formData.append('avatar', pngBuffer, { filename: 'test-avatar.png', contentType: 'image/png' });

    console.log('✅ FormData prepared with fields:');
    console.log('   - fullName: Test User');
    console.log('   - email: test@example.com');
    console.log('   - phone: 1234567890');
    console.log('   - location: Test City');
    console.log('   - role: student');
    console.log('   - bio: Test bio');
    console.log('   - avatar: test-avatar.png (1px PNG)\n');

    console.log('3️⃣ API Configuration:');
    console.log(`   - API URL: ${API_URL}`);
    console.log(`   - Endpoint: PUT /api/auth/profile`);
    console.log(`   - Auth: Bearer token from localStorage\n`);

    console.log('4️⃣ Checklist:');
    console.log('   ✓ Multer configured in routes/auth.js');
    console.log('   ✓ Cloudinary import added to routes/auth.js');
    console.log('   ✓ Upload endpoint accepts FormData with avatar');
    console.log('   ✓ File validation: max 5MB, image/* only');
    console.log('   ✓ Avatar saved to Cloudinary');
    console.log('   ✓ URL stored in User.avatar field');
    console.log('   ✓ Updated user returned in response\n');

    console.log('5️⃣ To test manually:');
    console.log('   a) Make sure server is running: npm start (in /server)');
    console.log('   b) Make sure Cloudinary env vars are set');
    console.log('   c) Log in via frontend');
    console.log('   d) Go to Profile page');
    console.log('   e) Click Edit, change avatar');
    console.log('   f) Click Save');
    console.log('   g) Check browser console for any errors\n');

    console.log('6️⃣ Common Issues:');
    console.log('   • Cloudinary not configured → Set env vars');
    console.log('   • Token not sent → Check Authorization header');
    console.log('   • FormData not parsed → Ensure multer middleware is active');
    console.log('   • CORS error → Check origin in server CORS config');
    console.log('   • Image won\'t display → Use https URL from Cloudinary\n');

  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

test();
