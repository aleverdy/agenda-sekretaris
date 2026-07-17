import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, startDate, endDate, location, participantIds } = body;

    const agenda = await prisma.agenda.create({
      data: {
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        location,
        participants: {
          create: participantIds.map((id: string) => ({
            participantId: id
          }))
        }
      }
    });

    return NextResponse.json({ success: true, agenda });
  } catch (error) {
    console.error('Error creating agenda:', error);
    return NextResponse.json({ success: false, error: 'Failed to create agenda' }, { status: 500 });
  }
}
