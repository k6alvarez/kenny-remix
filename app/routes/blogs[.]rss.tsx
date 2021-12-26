import type { LoaderFunction } from 'remix';
import { db } from '~/utils/db.server';

export let loader: LoaderFunction = async ({ request }) => {
  let blogs = await db.blog.findMany({
    take: 100,
    orderBy: { createdAt: 'desc' },
    include: { author: { select: { username: true } } },
  });

  let host =
    request.headers.get('X-Forwarded-Host') ?? request.headers.get('host');
  if (!host) {
    throw new Error('Could not determine domain URL.');
  }
  let protocol = host.includes('localhost') ? 'http' : 'https';
  let domain = `${protocol}://${host}`;
  let blogsUrl = `${domain}/blogs`;

  let rssString = `
    <rss xmlns:blogChannel="${blogsUrl}" version="2.0">
      <channel>
        <title>Kenny Alvarez Blog</title>
        <link>${blogsUrl}</link>
        <description>Some funny blogs</description>
        <language>en-us</language>
        <generator>Kody the Koala</generator>
        <ttl>40</ttl>
        ${blogs
          .map((blog) =>
            `
            <item>
              <title>${blog.name}</title>
              <description>A funny blog called ${blog.name}</description>
              <author>${blog.author.username}</author>
              <pubDate>${blog.createdAt}</pubDate>
              <link>${blogsUrl}/${blog.id}</link>
              <guid>${blogsUrl}/${blog.id}</guid>
            </item>
          `.trim()
          )
          .join('\n')}
      </channel>
    </rss>
  `.trim();

  return new Response(rssString, {
    headers: {
      'Cache-Control': `public, max-age=${60 * 10}, s-maxage=${60 * 60 * 24}`,
      'Content-Type': 'application/xml',
      'Content-Length': String(Buffer.byteLength(rssString)),
    },
  });
};
