import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../lib/db';
import { UserModel } from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     summary: Admin Login
 *     tags: [Admin Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful (Sets cookie)
 */
export async function loginAdmin(req: NextRequest) {
  await connectToDatabase();
  try {
    const { username, password } = await req.json();

    const user = await UserModel.findOne({ username });
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    // Assuming we hashed passwords, but fallback to plain if not for initial seed.
    // In production, always compare hashed password
    const isMatch = await bcrypt.compare(password, user.password!) || password === user.password;
    if (!isMatch) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1d' });

    const response = NextResponse.json({ message: 'Login successful', success: true });
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 86400, // 1 day
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/admin/logout:
 *   post:
 *     summary: Admin Logout
 *     tags: [Admin Auth]
 *     responses:
 *       200:
 *         description: Logout successful (Clears cookie)
 */
export async function logoutAdmin(req: NextRequest) {
  try {
    const response = NextResponse.json({ message: 'Logout successful', success: true });
    response.cookies.set('admin_token', '', {
      httpOnly: true,
      expires: new Date(0),
      path: '/',
    });
    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
