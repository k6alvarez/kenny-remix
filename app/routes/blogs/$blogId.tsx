import type { LoaderFunction, ActionFunction, MetaFunction } from 'remix';
import { Link, useLoaderData, useCatch, redirect, useParams } from 'remix';
import type { Blog } from '@prisma/client';
import { db } from '../../utils/db.server';
import { getUserId, requireUserId } from '../../utils/session.server';
import { BlogDisplay } from '../../components/blog';

export let meta: MetaFunction = ({
  data,
}: {
  data: LoaderData | undefined;
}) => {
  if (!data) {
    return {
      title: 'No blog',
      description: 'No blog found',
    };
  }
  return {
    title: `"${data.blog.name}" blog`,
    description: `Enjoy the "${data.blog.name}" blog and much more`,
  };
};

type LoaderData = { blog: Blog; isOwner: boolean };

export let loader: LoaderFunction = async ({ request, params }) => {
  let userId = await getUserId(request);

  let blog = await db.blog.findUnique({
    where: { id: params.blogId },
  });
  if (!blog) {
    throw new Response('What a blog! Not found.', {
      status: 404,
    });
  }
  let data: LoaderData = {
    blog,
    isOwner: userId === blog.authorId,
  };
  return data;
};

export let action: ActionFunction = async ({ request, params }) => {
  let form = await request.formData();
  if (form.get('_method') === 'delete') {
    let userId = await requireUserId(request);
    let blog = await db.blog.findUnique({
      where: { id: params.blogId },
    });
    if (!blog) {
      throw new Response("Can't delete what does not exist", { status: 404 });
    }
    if (blog.authorId !== userId) {
      throw new Response("Pssh, nice try. That's not your blog", {
        status: 401,
      });
    }
    await db.blog.delete({ where: { id: params.blogId } });
    return redirect('/blogs');
  }
};

export default function BlogRoute() {
  let data = useLoaderData<LoaderData>();

  return <BlogDisplay blog={data.blog} isOwner={data.isOwner} />;
}

export function CatchBoundary() {
  let caught = useCatch();
  let params = useParams();
  switch (caught.status) {
    case 404: {
      return (
        <div className="error-container">
          Huh? What the heck is {params.blogId}?
        </div>
      );
    }
    case 401: {
      return (
        <div className="error-container">
          Sorry, but {params.blogId} is not your blog.
        </div>
      );
    }
    default: {
      throw new Error(`Unhandled error: ${caught.status}`);
    }
  }
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  let { blogId } = useParams();
  return (
    <div className="error-container">{`There was an error loading blog by the id ${blogId}. Sorry.`}</div>
  );
}
