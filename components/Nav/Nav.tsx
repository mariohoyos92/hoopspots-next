import React, { useState } from 'react';
import cn from 'classnames';
import Link from 'next/link';
import StyledLink from '../StyledLink';
import { Router } from 'next/router';
import { UserRequestedDoc } from '../../pages/api/_models/user-model';
import appRoutes from '../../types/Routes';
import { Colors } from '../../types/Colors';

const Nav: React.FC<{ user?: UserRequestedDoc }> = ({ user }) => {
  const [profileDropDownIsOpen, setProfileDropdownIsOpen] = useState(false);
  const [hamburgerMenuIsOpen, setHamburgerMenuIsOpen] = useState(false);

  const handleHamburgerClick = () => {
    setHamburgerMenuIsOpen(!hamburgerMenuIsOpen);
    setProfileDropdownIsOpen(false);
  };

  const handleProfileDropdownClick = () => {
    setProfileDropdownIsOpen(!profileDropDownIsOpen);
    setHamburgerMenuIsOpen(false);
  };

  const closeAllDropdowns = () => {
    setProfileDropdownIsOpen(false);
    setHamburgerMenuIsOpen(false);
  };

  Router.events.on('routeChangeComplete', closeAllDropdowns);

  return (
    <nav style={{ background: Colors.black }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href={appRoutes.home}>
                <a className="font-bold text-3xl md:text-4xl">
                  <span className="text-white">
                    H<span className="text-red-600">S</span>
                  </span>
                </a>
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {
                // Profile dropdown
              }
              <div className="ml-3 relative">
                {user ? (
                  <div>
                    <button
                      className="max-w-xs flex items-center text-sm rounded-full text-white focus:outline-none focus:shadow-solid"
                      id="user-menu"
                      aria-label="User menu"
                      aria-haspopup="true"
                      onClick={handleProfileDropdownClick}
                    >
                      {user && user.profilePhotoUrl ? (
                        <img className="h-8 w-8 rounded-full" src={user.profilePhotoUrl} alt="avatar" />
                      ) : (
                        <svg fill="currentColor" viewBox="0 0 20 20" className="h-8 w-8 text-gray-400">
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      )}
                    </button>
                  </div>
                ) : (
                  <Link href={appRoutes.login} passHref>
                    <StyledLink>Login / Signup</StyledLink>
                  </Link>
                )}
                {
                  // Profile dropdown panel, show/hide based on dropdown state.
                  // Entering: "transition ease-out duration-100"
                  //   From: "transform opacity-0 scale-95"
                  //   To: "transform opacity-100 scale-100"
                  // Leaving: "transition ease-in duration-75"
                  //   From: "transform opacity-100 scale-100"
                  //   To: "transform opacity-0 scale-95"
                }
                <div
                  className={cn(
                    { hidden: !profileDropDownIsOpen },
                    'origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg'
                  )}
                >
                  <div
                    className="py-1 rounded-md bg-white shadow-xs"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu"
                  >
                    <Link href={appRoutes.profile}>
                      <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                        Your Profile
                      </a>
                    </Link>
                    <Link href={appRoutes.logout}>
                      <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                        Sign out
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            {
              // Mobile menu button -->
            }
            {user ? (
              <button
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white"
                onClick={handleHamburgerClick}
              >
                {
                  // Menu open: "hidden", Menu closed: "block" -->
                }
                <svg
                  className={cn({ hidden: hamburgerMenuIsOpen, block: !hamburgerMenuIsOpen }, 'h-6 w-6')}
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                {
                  // Menu open: "block", Menu closed: "hidden" -->
                }
                <svg
                  className={cn({ block: hamburgerMenuIsOpen, hidden: !hamburgerMenuIsOpen }, 'h-6 w-6')}
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            ) : (
              <Link href={appRoutes.login} passHref>
                <StyledLink>Login / Signup</StyledLink>
              </Link>
            )}
          </div>
        </div>
      </div>

      {
        //Mobile menu, toggle classes based on menu state.
        //  Open: "block", closed: "hidden"
      }
      <div className={cn({ hidden: !hamburgerMenuIsOpen, block: hamburgerMenuIsOpen }, 'md:hidden')}>
        <div className="pt-4 pb-3 border-t border-gray-700">
          <div className="flex items-center px-5">
            <div className="flex-shrink-0">
              {user && user.profilePhotoUrl ? (
                <img className="h-10 w-10 rounded-full" src={user.profilePhotoUrl} alt="avatar" />
              ) : (
                <svg fill="currentColor" viewBox="0 0 20 20" className="h-10 w-10 text-gray-400">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              )}
            </div>
            <div className="ml-3">
              <div className="text-base font-medium leading-none text-white">{user && user.name}</div>
            </div>
          </div>
          <div className="mt-3 px-2">
            <Link href={appRoutes.profile}>
              <a className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700">
                Your Profile
              </a>
            </Link>
            <Link href={appRoutes.logout}>
              <a className="mt-1 block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700">
                Sign out
              </a>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
