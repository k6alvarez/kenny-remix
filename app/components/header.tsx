import React from 'react';
import { Link } from 'remix';
import { CacutsIcon } from '~/components/images';

export const Header = () => {
  return (
    <header className="app-header">
      <h1>
        <CacutsIcon color="hsla(15, 86%, 53%, 1)" />
        Kenny Alvarez
      </h1>
      <nav>
        <ul>
          <li>
            <Link to="jokes">Read Jokes</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};
