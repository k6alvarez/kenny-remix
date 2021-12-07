import { User } from '@prisma/client';
import {
  Form,
  Link,
  LinksFunction,
  LoaderFunction,
  useLoaderData,
} from 'remix';
import { Outlet } from 'remix';
import { Footer } from '~/components/footer';
import { Header } from '~/components/header';
import { db } from '~/utils/db.server';
import { getUser } from '~/utils/session.server';
import stylesUrl from '../styles/blogs.css';

export let links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: stylesUrl,
    },
  ];
};

type LoaderData = {
  user: User | null;
  blogListItems: Array<{ id: string; name: string }>;
};

export let loader: LoaderFunction = async ({ request }) => {
  let blogListItems = await db.blog.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true },
  });
  let user = await getUser(request);

  let data: LoaderData = {
    blogListItems,
    user,
  };
  return data;
};

export default function JokesRoute() {
  let data = useLoaderData<LoaderData>();

  return (
    <>
      <Header />
      <div className="content">
        <div className="intro-section">
          {/* <Link to=".">Get a random blog</Link> */}
          <p>
            I do not blog a whole lot but here are a few of my most recent
            posts.
          </p>
          <ul>
            {data.blogListItems.map((blog) => (
              <li key={blog.id}>
                <Link prefetch="intent" to={blog.id}>
                  {blog.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="blogs-outlet">
            <Outlet />
          </div>
          {data.user?.role === 'ADMIN' && (
            <Link to="new" className="button">
              Add your own
            </Link>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
