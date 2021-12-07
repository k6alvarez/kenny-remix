import { User } from '@prisma/client';
import { LinksFunction, LoaderFunction, MetaFunction } from 'remix';
import { Cards } from '~/components/cards';
import { Footer } from '~/components/footer';
import { Header } from '~/components/header';
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
};

export let loader: LoaderFunction = async ({ request }) => {
  let user = await getUser(request);

  let data: LoaderData = {
    user,
  };
  return data;
};

export default function Index() {
  return (
    <>
      <Header />
      <div className="content">
        <div className="intro-section">
          <div className="logo">
            <h1>I'm a web developer.</h1>
          </div>
          <p>
            Welcome to my small part of the Internet. I am a web devloper living
            in Atlanta, Georgia but I was born and raised in Fennville,
            Michigan. When I'm not working on a web apps, I like to go for long
            runs, play soccer, eat tacos, and spend time with my soon to be
            wife. I hope y'all enjoy the content of my blog, I will share what I
            learn in my career in programming along with other parts of my life.
          </p>
        </div>
        <div className="intro-section">
          <h1>My Blogs</h1>
          <Cards />
        </div>
        <div className="intro-section">
          <h1>My Projects</h1>
          <Cards />
        </div>
      </div>
      <Footer />
    </>
  );
}
