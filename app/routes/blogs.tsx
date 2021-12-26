import { User } from '@prisma/client';
import {
  Form,
  Link,
  LinksFunction,
  LoaderFunction,
  useLoaderData,
} from 'remix';
import { Outlet } from 'remix';
import { Cards } from '~/components/cards';
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
  blogListItems: Array<{ id: string; name: string; image: string }>;
};

export let loader: LoaderFunction = async ({ request }) => {
  let blogListItems = await db.blog.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, image: true },
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
        <Outlet />
        <Cards data={data.blogListItems} title={'Other Posts'} />
        {data.user?.role === 'ADMIN' && (
          <Link to="new" className="button">
            Add New Blog
          </Link>
        )}
      </div>
      <Footer />
    </>
  );
}
