import matter from 'gray-matter';
import { join } from 'node:path';
import { readdir, readFile } from 'node:fs/promises';
import { unified } from 'unified';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeCodeTitles from 'rehype-code-titles';
import rehypeRaw from 'rehype-raw';
// import rehypeSanitize from "rehype-sanitize";

const postsDirectory = join(process.cwd(), '_posts');

const Parser = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  // .use(rehypeSanitize)
  .use(rehypePrettyCode, { theme: 'one-dark-pro' })
  .use(rehypeCodeTitles)
  .use(rehypeSlug)
  .use(rehypeAutolinkHeadings, {
    content: (arg) => ({
      type: 'element',
      tagName: 'a',
      properties: {
        href: `#${arg.properties?.id}`,
        style: 'margin-right: 10px',
      },
      children: [{ type: 'text', value: '#' }],
    }),
  })
  .use(rehypeStringify);

export async function getPost(filename: string) {
  const resolvedPath = join(postsDirectory, filename);
  const fileAsString = await readFile(resolvedPath, 'utf8');
  const parsed = matter(fileAsString);
  const html = await Parser.process(parsed.content);
  return {
    id: filename.replace(/\.md$/, ''),
    date: parsed.data.date as Date,
    html: html.value.toString(),
    title: parsed.data.title as string,
  };
}

export async function getAllPostsMetadata() {
  const files = await readdir(postsDirectory);
  const promises = files
    .filter((filename) => filename.endsWith('.md'))
    .map((filename) => getPost(filename));
  const results = await Promise.allSettled(promises);
  return results
    .filter((p) => p.status === 'fulfilled')
    .map((p) => p.value)
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
    .reduce(
      (acc, post) => {
        const { html: __html, ...rest } = post;
        acc[post.id] = rest;
        return acc;
      },
      {} as Record<string, Omit<Awaited<ReturnType<typeof getPost>>, 'html'>>,
    );
}
