import { User } from '@prisma/client';
import {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
  useLoaderData,
} from 'remix';
import { Cards } from '~/components/cards';
import { Footer } from '~/components/footer';
import { Header } from '~/components/header';
import { db } from '~/utils/db.server';
import { getUser } from '~/utils/session.server';
import stylesUrl from '../styles/index.css';

export let links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: stylesUrl,
    },
  ];
};

export let meta: MetaFunction = () => {
  return {
    title: 'Kenny Alvarez personal website and blog',
    description: 'Hola Mundo! Welcome to my web developer portfolio and blog.',
  };
};

type LoaderData = {
  user: User | null;
  blogListItems: Array<{ id: string; name: string }>;
};

export let loader: LoaderFunction = async ({ request }) => {
  let user = await getUser(request);
  let blogListItems = await db.blog.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, image: true },
  });

  let data: LoaderData = {
    user,
    blogListItems,
  };
  return data;
};

export default function Index() {
  let data = useLoaderData();
  return (
    <>
      <Header />
      <div className="content">
        <div className="content-section">
          <div className="logo">
            <h1>I'm a web developer.</h1>
          </div>
          <p>
            Welcome to my small part of the Internet. I am a web devloper
            currently traveling the country with my fiancée. When I'm not
            working on a web apps, I like to go for long runs, play soccer, eat
            tacos, and explore nature. I hope y'all enjoy the content of my
            blog, I will share what I learn in my career in programming along
            with other parts of my life.
          </p>
        </div>

        <Cards data={data.blogListItems} title="My Blogs" />
        {/* <div className="content-section">
          <h1>My Projects</h1>
          <Cards data={[]} />
        </div> */}
      </div>
      <Footer />
    </>
  );
}
