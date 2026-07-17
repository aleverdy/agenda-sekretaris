import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, type, email, phone } = body;

    const participant = await prisma.participant.create({
      data: {
        name,
        type,
        email: email || null,
        phone: phone || null
      }
    });

    return NextResponse.json({ success: true, participant });
  } catch (error) {
    console.error('Error creating participant:', error);
    return NextResponse.json({ success: false, error: 'Failed to create participant' }, { status: 500 });
  }
}
