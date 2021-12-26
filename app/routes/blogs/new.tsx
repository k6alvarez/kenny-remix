import type { ActionFunction, LoaderFunction } from 'remix';
import {
  useActionData,
  redirect,
  useCatch,
  Link,
  Form,
  useTransition,
} from 'remix';
import { BlogDisplay } from '~/components/blog';
import { db } from '~/utils/db.server';
import { requireUserId, getUserId } from '~/utils/session.server';

export let loader: LoaderFunction = async ({ request }) => {
  let userId = await getUserId(request);
  if (!userId) {
    throw new Response('Unauthorized', { status: 401 });
  }
  return {};
};

function validateJokeContent(content: string) {
  if (content.length < 10) {
    return `That blog is too short`;
  }
}

function validateImageContent(content: string) {
  if (content.length < 10) {
    return `That url is too short`;
  }
}

function validateJokeName(name: string) {
  if (name.length < 2) {
    return `That blog's name is too short`;
  }
}

type ActionData = {
  formError?: string;
  fieldErrors?: {
    name: string | undefined;
    content: string | undefined;
    image: string | undefined;
  };
  fields?: {
    name: string;
    content: string;
    image: string;
  };
};

export let action: ActionFunction = async ({
  request,
}): Promise<Response | ActionData> => {
  let userId = await requireUserId(request);
  let form = await request.formData();
  let name = form.get('name');
  let content = form.get('content');
  let image = form.get('image');
  if (
    typeof name !== 'string' ||
    typeof content !== 'string' ||
    typeof image !== 'string'
  ) {
    return { formError: `Form not submitted correctly.` };
  }

  let fieldErrors = {
    name: validateJokeName(name),
    content: validateJokeContent(content),
    image: validateImageContent(image),
  };
  let fields = { name, content, image };
  if (Object.values(fieldErrors).some(Boolean)) {
    return { fieldErrors, fields };
  }

  let blog = await db.blog.create({
    data: { ...fields, authorId: userId },
  });
  return redirect(`/blogs/${blog.id}`);
};

export default function NewJokeRoute() {
  let actionData = useActionData<ActionData | undefined>();
  let transition = useTransition();

  if (transition.submission) {
    let name = transition.submission.formData.get('name');
    let content = transition.submission.formData.get('content');
    let image = transition.submission.formData.get('image');
    if (
      typeof name === 'string' &&
      typeof content === 'string' &&
      typeof image === 'string' &&
      !validateJokeContent(content) &&
      !validateJokeName(name) &&
      !validateImageContent(image)
    ) {
      return (
        <BlogDisplay
          blog={{ name, content }}
          isOwner={true}
          canDelete={false}
        />
      );
    }
  }

  return (
    <div>
      <p>Add your own hilarious blog</p>
      <Form method="post">
        <div>
          <label>
            Name:{' '}
            <input
              type="text"
              defaultValue={actionData?.fields?.name}
              name="name"
              aria-invalid={Boolean(actionData?.fieldErrors?.name) || undefined}
              aria-describedby={
                actionData?.fieldErrors?.name ? 'name-error' : undefined
              }
            />
          </label>
          <label>
            Image:{' '}
            <input
              type="text"
              defaultValue={actionData?.fields?.image}
              name="image"
              aria-invalid={
                Boolean(actionData?.fieldErrors?.image) || undefined
              }
              aria-describedby={
                actionData?.fieldErrors?.image ? 'image-error' : undefined
              }
            />
          </label>
          {actionData?.fieldErrors?.name ? (
            <p className="form-validation-error" role="alert" id="name-error">
              {actionData.fieldErrors.name}
            </p>
          ) : null}
        </div>
        <div>
          <label>
            Content:{' '}
            <textarea
              defaultValue={actionData?.fields?.content}
              name="content"
              aria-invalid={
                Boolean(actionData?.fieldErrors?.content) || undefined
              }
              aria-describedby={
                actionData?.fieldErrors?.content ? 'content-error' : undefined
              }
            />
          </label>
          {actionData?.fieldErrors?.content ? (
            <p
              className="form-validation-error"
              role="alert"
              id="content-error"
            >
              {actionData.fieldErrors.content}
            </p>
          ) : null}
        </div>
        <div>
          <button type="submit" className="button">
            Add
          </button>
        </div>
      </Form>
    </div>
  );
}

export function CatchBoundary() {
  let caught = useCatch();

  if (caught.status === 401) {
    return (
      <div className="error-container">
        <p>You must be logged in to create a blog.</p>
        <Link to="/login">Login</Link>
      </div>
    );
  }
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return (
    <div className="error-container">
      Something unexpected went wrong. Sorry about that.
    </div>
  );
}
