import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    await prisma.agenda.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: 'Agenda berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting agenda:', error);
    return NextResponse.json({ success: false, error: 'Gagal menghapus agenda' }, { status: 500 });
  }
}
