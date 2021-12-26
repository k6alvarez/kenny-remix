import React from 'react';
import { User } from '@prisma/client';
import { Form, Link, LoaderFunction, useLoaderData } from 'remix';
import { CacutsIcon } from '~/components/images';
import { getUser } from '~/utils/session.server';

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

export const Header = () => {
  let data = useLoaderData<LoaderData>();
  return (
    <header className="app-header">
      <Link to="/">
        <h1>
          <CacutsIcon color="hsla(112, 49%, 81%, 1)" />
          KA
        </h1>
      </Link>
      <nav>
        <ul>
          {/* <li>
            <Link to="jokes">Photos</Link>
          </li> */}
          {/* <li>
            <Link to="jokes">Code</Link>
          </li>
          */}
          <li>
            <Link to="/blogs">Blogs</Link>
          </li>
          <li>
            {data?.user ? (
              <Form action="/logout" method="post">
                <button type="submit" className="button">
                  Logout
                </button>
              </Form>
            ) : (
              <Link to="/login">Login</Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};
