import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../lib/db';
import { ContactModel } from '../models/Contact';

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
  await connectToDatabase();
  try {
    const body = await req.json();
    const contact = new ContactModel(body);
    await contact.save();
    return NextResponse.json({ message: 'Message sent successfully', success: true }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
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
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const sort = searchParams.get('sort') === 'asc' ? 1 : -1;

  const skip = (page - 1) * limit;

  try {
    const contacts = await ContactModel.find({})
      .sort({ createdAt: sort })
      .skip(skip)
      .limit(limit);
    
    const total = await ContactModel.countDocuments({});

    return NextResponse.json({ contacts, total, page, limit, success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
