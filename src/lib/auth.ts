import { cookies } from 'next/headers';

export async function getIsAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get('agenda_admin_session');
  return session?.value === 'true';
}
