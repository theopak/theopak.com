import matter from "gray-matter";
import path from "path";
import { unified } from "unified";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypePrettyCode from "rehype-pretty-code";
import { readdir, readFile } from "node:fs/promises";
import rehypeCodeTitles from "rehype-code-titles";
// import rehypeAddClasses from "rehype-add-classes";
import rehypeRaw from "rehype-raw";
// import rehypeSanitize from "rehype-sanitize";

const postsDirectory = path.join(process.cwd(), "_posts");

const Parser = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  // .use(rehypeSanitize)
  .use(rehypePrettyCode, { theme: "one-dark-pro" })
  .use(rehypeCodeTitles)
  .use(rehypeSlug)
  .use(rehypeAutolinkHeadings, {
    content: (arg) => ({
      type: "element",
      tagName: "a",
      properties: {
        href: `#${arg.properties?.id}`,
        style: "margin-right: 10px",
      },
      children: [{ type: "text", value: "#" }],
    }),
  })
  .use(rehypeStringify);

export async function getPost(filename: string) {
  const fullPath = path.join(postsDirectory, filename);
  const fileAsString = await readFile(fullPath, "utf8");
  const parsed = matter(fileAsString);

  const html = await Parser.process(parsed.content);
  const date = parsed.data.date as Date;

  return {
    id: filename.replace(/\.md$/, ""),
    date,
    html: html.value.toString(),
    title: parsed.data.title as string,
  };
}

export async function getAllPosts() {
  const files = await readdir(postsDirectory);
  const promises = files
    .filter((filename) => filename.endsWith(".md"))
    .map((filename) => getPost(filename));
  const results = await Promise.allSettled(promises);
  return results
    .filter((p) => p.status === "fulfilled")
    .map((p) => p.value)
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
}
