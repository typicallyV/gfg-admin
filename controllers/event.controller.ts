import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../lib/db';
import { EventModel } from '../models/Event';

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Get events list
 *     description: Retrieve events with optional filters (status, order, limit, page, upcoming)
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: upcoming
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: List of events
 */
export async function getEvents(req: NextRequest) {
  await connectToDatabase();
  const searchParams = req.nextUrl.searchParams;
  const status = searchParams.get('status');
  const order = searchParams.get('order') === 'desc' ? -1 : 1;
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const upcoming = searchParams.get('upcoming') === 'true';

  const query: any = {};
  if (status) query.registrationStatus = status;
  if (upcoming) query.startDate = { $gte: new Date() };

  const skip = (page - 1) * limit;

  try {
    const events = await EventModel.find(query)
      .sort({ startDate: order })
      .skip(skip)
      .limit(limit);
    const total = await EventModel.countDocuments(query);

    return NextResponse.json({ events, total, page, limit, success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/event/{id}:
 *   get:
 *     summary: Get event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event details
 */
export async function getEventById(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();
  try {
    const event = await EventModel.findById(params.id);
    if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    return NextResponse.json({ event, success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/event/{id}/registration:
 *   post:
 *     summary: Register for an event
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userDetails:
 *                 type: object
 *     responses:
 *       200:
 *         description: Successful registration
 */
export async function registerForEvent(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();
  try {
    const body = await req.json();
    const event = await EventModel.findById(params.id);
    
    if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    if (event.registrationStatus !== 'open') {
      return NextResponse.json({ error: 'Registration is closed for this event' }, { status: 400 });
    }

    // Logic to save registration details would go here
    // For now, increment registration count
    event.registrationsCount += 1;
    await event.save();

    return NextResponse.json({ message: 'Registration successful', success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/admin/events:
 *   post:
 *     summary: Admin - Create an event
 *     tags: [Admin Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Event created
 */
export async function createEvent(req: NextRequest) {
  await connectToDatabase();
  try {
    const body = await req.json();
    const event = new EventModel(body);
    await event.save();
    return NextResponse.json({ event, success: true }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

/**
 * @swagger
 * /api/admin/events/{id}:
 *   put:
 *     summary: Admin - Update an event
 *     tags: [Admin Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Event updated
 */
export async function updateEvent(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();
  try {
    const body = await req.json();
    const event = await EventModel.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
    if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    return NextResponse.json({ event, success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
