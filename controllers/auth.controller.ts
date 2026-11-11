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
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful (Sets cookie)
 */
export async function loginAdmin(req: NextRequest) {
  try {
    await connectToDatabase();

    let body: { email?: string; password?: string } | null = null;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid JSON request body' }, { status: 400 });
    }

    const { email, password } = body || {};
    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 });
    }

    const user = await UserModel.findOne({ email });
    if (!user || !user.password) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    let isMatch = false;
    try {
      isMatch = await bcrypt.compare(password, user.password);
    } catch {
      isMatch = false;
    }

    if (!isMatch && password === user.password) {
      isMatch = true;
    }

    if (!isMatch) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    const response = NextResponse.json({
      message: 'Login successful',
      success: true,
      role: user.role,
    });

    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 86400, // 1 day
      sameSite: 'lax',
    });

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Login failed';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
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
export async function logoutAdmin() {
  try {
    const response = NextResponse.json({ message: 'Logout successful', success: true });
    response.cookies.set('admin_token', '', {
      httpOnly: true,
      expires: new Date(0),
      path: '/',
    });
    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Logout failed';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/check-role:
 *   post:
 *     summary: Check role by email
 *     tags: [Admin Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Role retrieval successful
 */
export async function checkEmailRole(req: NextRequest) {
  try {
    await connectToDatabase();

    let body: { email?: string } | null = null;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
    }

    const { email } = body || {};
    if (!email) return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });

    const user = await UserModel.findOne({ email });
    if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });

    return NextResponse.json({ success: true, role: user.role });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error checking role';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
