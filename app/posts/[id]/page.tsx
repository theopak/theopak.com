import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getPost, getAllPostsMetadata } from '../../../lib/api';
import { WindowManager } from '../../../components/WindowManager';

export default async function PageForPost({ params }) {
  const { id } = await params;
  const posts = await getAllPostsMetadata();
  const post = await getPost(`${id}.md`);
  return (
    <Suspense fallback={null}>
      <WindowManager posts={posts} primaryPost={post} />
    </Suspense>
  );
}

export async function generateMetadata({ params }): Promise<Metadata> {
  const { id } = await params;
  const { date, title } = await getPost(`${id}.md`);
  return {
    authors: {
      name: 'Theo Pak',
      url: 'https://theopak.com',
    },
    openGraph: {
      publishedTime: date.toUTCString(),
      title,
      type: 'article',
    },
    title,
  };
}

export async function generateStaticParams() {
  const posts = await getAllPostsMetadata();
  return Object.values(posts).map((post) => ({
    id: post.id,
  }));
}
