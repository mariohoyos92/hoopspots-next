import React from 'react';
import App from 'next/app';
import Router from 'next/router';
import NProgress from 'nprogress';
import auth0 from '../lib/auth0';

import 'lazysizes';
import 'lazysizes/plugins/attrchange/ls.attrchange';

import '../styles/index.css';
import { getUserById, createUser } from './api/_repositories/user-repository';
import connectToMongo from './api/_database-connections/mongoose-connection';
import { UserFromAuth } from './api/_models/user-model';
import Nav from '../components/Nav';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeError', () => NProgress.done());
Router.events.on('routeChangeComplete', () => NProgress.done());

class AppWrapper extends App<{}> {
  public render() {
    const { Component, pageProps } = this.props;
    return (
      <main>
        <Nav />
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <h1 className="text-lg leading-6 font-semibold text-gray-900">Dashboard</h1>
          </div>
        </header>
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Component {...pageProps} />
        </div>
        <style jsx global>
          {`
            #__next {
              min-height: 100vh;
              display: flex;
              flex-flow: column nowrap;
            }

            .modal-dialog {
              min-height: 375px;
              max-height: 750px;
              width: 492px;
            }

            /* Make clicks pass-through */
            #nprogress {
              pointer-events: none;
            }

            #nprogress .bar {
              background: #017c6b;

              position: fixed;
              z-index: 1031;
              top: 0;
              left: 0;

              width: 100%;
              height: 2px;
            }

            /* Fancy blur effect */
            #nprogress .peg {
              display: block;
              position: absolute;
              right: 0px;
              width: 100px;
              height: 100%;
              box-shadow: 0 0 10px #29d, 0 0 5px #29d;
              opacity: 1;

              -webkit-transform: rotate(3deg) translate(0px, -4px);
              -ms-transform: rotate(3deg) translate(0px, -4px);
              transform: rotate(3deg) translate(0px, -4px);
            }

            .big-z {
              z-index: 999999 !important;
            }
          `}
        </style>
      </main>
    );
  }
}

async function getOrCreateUserProfileFromAuthUser(user: UserFromAuth) {
  const { sub, email, name, nickname, picture } = user;
  await connectToMongo();
  let userProfile = await getUserById(sub);
  if (!userProfile) {
    const createdProfile = await createUser({ userId: sub, email, profilePhotoUrl: picture, name: nickname || name });
    userProfile = createdProfile;
  }
  return userProfile;
}

AppWrapper.getInitialProps = async appContext => {
  const appProps = await App.getInitialProps(appContext);
  const response = await auth0.getSession(appContext.ctx.req);
  const userHasAuth0Account = response && response.user;
  let user;
  if (userHasAuth0Account) {
    user = await getOrCreateUserProfileFromAuthUser(response.user as UserFromAuth);
  }
  return { pageProps: { ...appProps.pageProps, user } };
};

export default AppWrapper;
