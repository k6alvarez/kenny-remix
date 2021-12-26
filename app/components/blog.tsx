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
      <div className="content-section">
        <h1>{blog.name}</h1>
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
    </div>
  );
}
