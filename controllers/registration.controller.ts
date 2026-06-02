import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../lib/db';
import { RegistrationModel } from '../models/Registration';
import { EventModel } from '../models/Event';
import { ObjectId } from 'mongoose';

export async function getRegisteredUsersByEventId(req: NextRequest, { params }: { params: { eventId: ObjectId } }) {
  await connectToDatabase();
  try {
    const event = await EventModel.findById(params.eventId);
    if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });

    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = Math.min(parseInt(searchParams.get('limit') || '10', 10), 100);
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const order = searchParams.get('order') === 'asc' ? 1 : -1;
    
    const skip = (page - 1) * limit;
    const total = await RegistrationModel.countDocuments({ eventId: params.eventId });
    
    const registrations = await RegistrationModel.find({ eventId: params.eventId })
      .sort({ [sortBy]: order })
      .skip(skip)
      .limit(limit);
    
    return NextResponse.json({ 
      registrations, 
      success: true,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function getRegisteredUserByEventId(req: NextRequest, { params }: { params: { id: ObjectId } }) {
  await connectToDatabase();
  try {
    const searchParams = req.nextUrl.searchParams;
    const teamId = searchParams.get('teamId');
    const teamName = searchParams.get('teamName');
    const email = searchParams.get('email');
    const name = searchParams.get('name');

    const filter: any = { _id: params.id };
    if (teamId) filter.teamId = teamId;
    if (teamName) filter.teamName = { $regex: teamName, $options: 'i' };
    if (email) filter.email = { $regex: email, $options: 'i' };
    if (name) filter.name = { $regex: name, $options: 'i' };
    
    const registration = await RegistrationModel.findOne(filter);
    if (!registration) return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    
    return NextResponse.json({ registration, success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
