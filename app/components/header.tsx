import React from 'react';
import { Link } from 'remix';
import { CacutsIcon } from '~/components/images';

export const Header = () => {
  return (
    <header className="app-header">
      <h1>
        <CacutsIcon color="hsla(112, 49%, 81%, 1)" />
        Kenny Alvarez
      </h1>
      <nav>
        <ul>
          {/* <li>
            <Link to="jokes">Photos</Link>
          </li> */}
          {/* <li>
            <Link to="jokes">Code</Link>
          </li>
          <li>
            <Link to="jokes">Blog</Link>
          </li> */}
          <li>
            <Link to="/login">Login</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};
