import type { LoaderFunction } from 'remix';
import { useLoaderData, Link, useCatch } from 'remix';
import type { Blog } from '@prisma/client';
import { db } from '~/utils/db.server';

type LoaderData = { randomBlog: Blog };

export let loader: LoaderFunction = async () => {
  let count = await db.blog.count();
  let randomRowNumber = Math.floor(Math.random() * count);
  let [randomBlog] = await db.blog.findMany({
    take: 1,
    skip: randomRowNumber,
  });
  if (!randomBlog) {
    throw new Response('No random blog found', {
      status: 404,
    });
  }
  let data: LoaderData = { randomBlog };
  return data;
};

export default function BlogsIndexRoute() {
  let data = useLoaderData<LoaderData>();

  return (
    <>
      <div className="content-section">
        <h1>Talking my shit.</h1>
        <p>
          My blogs posts will mostly focus on my career as a software developer.
          I hope to also share my experiences living as a remote worker while
          traveling with my finacée. Other content may include my hobbies,
          product reviews, along with any life lessons learned. Below you'll
          find my recent blogs along with a random blog for a preview of my
          content. 😃
        </p>
      </div>
      <div className="content-section">
        <h1>{data.randomBlog.name}</h1>
        <p>{data.randomBlog.content}</p>
        <Link to={data.randomBlog.id}>"{data.randomBlog.name}" Permalink</Link>
      </div>
    </>
  );
}

export function CatchBoundary() {
  let caught = useCatch();

  if (caught.status === 404) {
    return (
      <div className="error-container">
        I'm still working on adding blogs. No hay nada aqui.
      </div>
    );
  }
  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}

export function ErrorBoundary() {
  return <div className="error-container">I did a whoopsies.</div>;
}
