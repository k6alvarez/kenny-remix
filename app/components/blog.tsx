import { Link, Form } from 'remix';
import type { Blog } from '@prisma/client';

export function BlogDisplay({
  blog,
  isOwner,
  canDelete = true,
}: {
  blog: Pick<Blog, 'content' | 'name'>;
  isOwner: boolean;
  canDelete?: boolean;
}) {
  return (
    <div>
      <p>Here's your hilarious blog:</p>
      <p>{blog.content}</p>
      <Link to=".">{blog.name} Permalink</Link>
      {isOwner ? (
        <Form method="post">
          <input type="hidden" name="_method" value="delete" />
          <button type="submit" className="button" disabled={!canDelete}>
            Delete
          </button>
        </Form>
      ) : null}
    </div>
  );
}
