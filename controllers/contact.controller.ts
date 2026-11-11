import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../lib/db';
import { ContactModel } from '../models/Contact';

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

/**
 * @swagger
 * /api/contact:
 *   post:
 *     summary: Submit a contact message
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message sent successfully
 */
export async function createContact(req: NextRequest) {
  try {
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON request body.' },
        {
          status: 400,
          headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
        }
      );
    }

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json(
        { success: false, error: 'Request body must be a JSON object.' },
        {
          status: 400,
          headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
        }
      );
    }

    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const description = typeof body.description === 'string' ? body.description.trim() : '';

    if (!name || name.length < 2 || name.length > 100) {
      return NextResponse.json(
        { success: false, error: 'Name is required and must be between 2 and 100 characters.' },
        {
          status: 400,
          headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
        }
      );
    }

    if (!email || email.length > 254 || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { success: false, error: 'A valid email address is required.' },
        {
          status: 400,
          headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
        }
      );
    }

    if (!title || title.length < 5 || title.length > 100) {
      return NextResponse.json(
        { success: false, error: 'Title is required and must be between 5 and 100 characters.' },
        {
          status: 400,
          headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
        }
      );
    }

    if (!description || description.length < 20 || description.length > 2000) {
      return NextResponse.json(
        { success: false, error: 'Description is required and must be between 20 and 2000 characters.' },
        {
          status: 400,
          headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
        }
      );
    }

    await connectToDatabase();

    const contact = new ContactModel({
      name,
      email,
      title,
      description,
    });
    await contact.save();

    return NextResponse.json(
      { success: true, message: 'Message sent successfully.' },
      {
        status: 201,
        headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
      }
    );
  } catch (error: unknown) {
    console.error('Contact creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send message. Please try again later.' },
      {
        status: 500,
        headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
      }
    );
  }
}

/**
 * @swagger
 * /api/admin/contact:
 *   get:
 *     summary: Admin - Get contact messages
 *     tags: [Admin Contact]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: sort
 *         description: Sort order (asc or desc)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of contact messages
 */
export async function getContacts(req: NextRequest) {
  await connectToDatabase();
  const searchParams = req.nextUrl.searchParams;

  const rawLimit = parseInt(searchParams.get('limit') || '10', 10);
  const limit = Number.isInteger(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, 50) : 10;

  const rawPage = parseInt(searchParams.get('page') || '1', 10);
  const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;

  const sort = searchParams.get('sort') === 'asc' ? 1 : -1;
  const skip = (page - 1) * limit;

  try {
    const contacts = await ContactModel.find({})
      .sort({ createdAt: sort })
      .skip(skip)
      .limit(limit);
    
    const total = await ContactModel.countDocuments({});

    return NextResponse.json({ success: true, contacts, total, page, limit });
  } catch (error: unknown) {
    console.error('Failed to retrieve messages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve messages.' },
      { status: 500 }
    );
  }
}
