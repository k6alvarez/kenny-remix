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

export const Footer = () => {
  let data = useLoaderData<LoaderData>();
  return (
    <footer className="app-footer">
      <span>© {new Date().getFullYear()} Kenny Alvarez</span>
      {data.user && <span>{`Logged in as ${data.user.username}`}</span>}
    </footer>
  );
};
