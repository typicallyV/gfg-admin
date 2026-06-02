import { NextRequest, NextResponse } from 'next/server';
// import { uploadImage } from '@/controllers/image.controller';

export async function POST(req: NextRequest) {
  const response = {
    url: 'https://res.cloudinary.com/dwpnijv0f/image/upload/v1780327904/gfg-admin/w3fhyjrhndadkcjgzamx.png',
    publicId: 'gfg-admin/w3fhyjrhndadkcjgzamx',
    success: true
  }
  return NextResponse.json(response);
  // return uploadImage(req);
}