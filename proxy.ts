import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const WWW_HOST = 'www.elitepartz.com';
const CANONICAL = 'https://elitepartz.com';

export function proxy(request: NextRequest) {
  const host = request.headers.get('host') ?? '';
  const { pathname, search } = request.nextUrl;

  // Redirect www → non-www (301 permanent)
  if (host === WWW_HOST) {
    return NextResponse.redirect(`${CANONICAL}${pathname}${search}`, { status: 301 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
