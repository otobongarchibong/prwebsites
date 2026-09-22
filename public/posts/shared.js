const OWNER = 'otobongarchibong';
const REPO = 'prwebsites';
const BRANCH = 'main';
const API_LIST = `https://api.github.com/repos/${OWNER}/${REPO}/contents/content/posts?ref=${BRANCH}`;
const RAW_BASE = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/content/posts/`;

// Minimal YAML-frontmatter parser: handles simple `key: value` lines only,
// which is all the CMS's current fields (title, date) produce.
function parseFrontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { data: {}, body: text };
  const data = {};
  m[1].split('\n').forEach((line) => {
    const i = line.indexOf(':');
    if (i === -1) return;
    data[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^['"]|['"]$/g, '');
  });
  return { data, body: m[2].trim() };
}

async function fetchPostList() {
  const res = await fetch(API_LIST);
  if (!res.ok) throw new Error('Could not load posts list (' + res.status + ')');
  const files = (await res.json()).filter((f) => f.name.endsWith('.md'));
  const posts = await Promise.all(
    files.map(async (f) => {
      const raw = await fetch(RAW_BASE + f.name).then((r) => r.text());
      const { data } = parseFrontmatter(raw);
      return { file: f.name, title: data.title || f.name, date: data.date || '' };
    })
  );
  posts.sort((a, b) => (a.date < b.date ? 1 : -1));
  return posts;
}

async function fetchPost(file) {
  const res = await fetch(RAW_BASE + file);
  if (!res.ok) throw new Error('Post not found');
  return parseFrontmatter(await res.text());
}
