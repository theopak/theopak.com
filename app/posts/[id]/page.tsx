import type { Metadata } from "next";
import { getPost, getAllPosts } from "../../../lib/api";
import { WindowManager } from "../../../components/WindowManager";

export default async function PageForPost({ params }) {
  const { id } = await params;
  const post = await getPost(`${id}.md`);
  return <WindowManager primaryPost={post} />;
}

export async function generateMetadata({ params }): Promise<Metadata> {
  const { id } = await params;
  const { date, title } = await getPost(`${id}.md`);
  return {
    title,
    authors: { name: "Theo Pak", url: "https://theopak.com" },
    openGraph: {
      type: "article",
      title,
      publishedTime: date.toUTCString(),
    },
  };
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    id: post.id,
  }));
}
