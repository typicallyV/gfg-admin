import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '../lib/cloudinary';
import type { UploadApiResponse } from 'cloudinary';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * @swagger
 * /api/admin/create-image-url:
 *   post:
 *     summary: Upload image to Cloudinary and return URL
 *     tags: [Admin Images]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image URL and Public ID
 */
export async function uploadImage(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('photo');

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No valid image file provided' }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type) && !file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Invalid file type. Only images are permitted.' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File size exceeds maximum limit of 10MB.' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'gfg-admin' },
        (error, uploadResult) => {
          if (error || !uploadResult) reject(error || new Error('Upload failed'));
          else resolve(uploadResult);
        }
      ).end(buffer);
    });

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
      success: true,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Image upload failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

