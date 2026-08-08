import { NextResponse } from 'next/server';
import { newsService } from '@/application/container';
import { News } from '@/domain/entities/News';

export const dynamic = 'force-static';

export async function GET() {
  try {
    const news = await newsService.getPublishedNews();
    const json = news.map((n) => ({
      id: n.id,
      title: n.title,
      content: n.content,
      image: n.image,
      isPublished: n.isPublished,
      createdAt: n.createdAt,
    }));
    return NextResponse.json(json);
  } catch (error: any) {
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newsId = body.id || `NEWS-${Date.now().toString(36)}`;
    const news = new News({
      id: newsId,
      title: body.title,
      content: body.content,
      image: body.image || '/assets/menu/slider/slide-2.jpg',
      isPublished: body.isPublished ?? true,
    });
    const created = await newsService.createNews(news);
    return NextResponse.json({ success: true, news: created });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    await newsService.deleteNews(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
