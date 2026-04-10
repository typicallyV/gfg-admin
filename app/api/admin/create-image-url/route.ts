import { NextRequest } from 'next/server';
import { uploadImage } from '@/controllers/image.controller';

export async function POST(req: NextRequest) {
  return uploadImage(req);
}