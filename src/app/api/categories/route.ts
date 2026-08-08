import { NextResponse } from 'next/server';
import { categoryRepo } from '@/application/container';

export const dynamic = 'force-static';

export async function GET() {
  try {
    const categories = await categoryRepo.findAll();
    const json = categories.map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      sortOrder: c.sortOrder,
    }));
    return NextResponse.json(json);
  } catch (error: any) {
    return NextResponse.json([]);
  }
}
