import { NextResponse } from 'next/server';
import { categoryRepo } from '@/application/container';
import { STATIC_CATEGORIES } from '@/domain/staticData';

export const dynamic = 'force-static';

export async function GET() {
  try {
    let categories: any[] = [];
    try {
      categories = await categoryRepo.findAll();
    } catch (e) {
      categories = [];
    }

    if (!categories || categories.length === 0) {
      return NextResponse.json(STATIC_CATEGORIES);
    }

    const json = categories.map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      sortOrder: c.sortOrder,
    }));
    return NextResponse.json(json);
  } catch (error: any) {
    return NextResponse.json(STATIC_CATEGORIES);
  }
}
