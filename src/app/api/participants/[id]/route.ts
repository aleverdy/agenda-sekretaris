import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await prisma.participant.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: 'Peserta berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting participant:', error);
    return NextResponse.json({ success: false, error: 'Gagal menghapus peserta' }, { status: 500 });
  }
}
