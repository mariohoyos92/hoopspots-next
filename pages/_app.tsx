import React from 'react';
import App from 'next/app';
import Router from 'next/router';
import NProgress from 'nprogress';
import auth0 from '../lib/auth0';

import 'lazysizes';
import 'lazysizes/plugins/attrchange/ls.attrchange';

import '../styles/index.css';
import 'react-datepicker/dist/react-datepicker.css';
import { getUserById, createUser } from './api/_repositories/user-repository';
import connectToMongo from './api/_database-connections/mongoose-connection';
import { UserFromAuth, UserRequestedDoc } from './api/_models/user-model';
import Nav from '../components/Nav';
import isServer from '../utils/isServer';
import { UserProvider } from '../lib/userContext';
import { getUserProfile } from '../services/user-service';
import Header from '../components/Header';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeError', () => NProgress.done());
Router.events.on('routeChangeComplete', () => NProgress.done());

// TODO: update all meta tags across the app

class AppWrapper extends App<{ user: UserRequestedDoc }> {
  public render() {
    const { Component, pageProps } = this.props;

    return (
      <div className="page-container bg-gray-100">
        <UserProvider user={pageProps.user}>
          <Nav user={pageProps.user} />
          <Header {...pageProps} />
          <main>
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
              <div className="px-4 py-8 sm:px-0">
                <Component {...pageProps} />
              </div>
            </div>
          </main>
        </UserProvider>
        <style jsx global>
          {`
            .page-container {
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
      </div>
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
  let user;
  if (isServer()) {
    const response = await auth0.getSession(appContext.ctx.req);
    const userHasAuth0Account = response && response.user;
    if (userHasAuth0Account) {
      user = await getOrCreateUserProfileFromAuthUser(response.user as UserFromAuth);
    }
  } else {
    user = await getUserProfile().catch(e => {
      if (e.message.includes('404')) {
        return;
      }
      throw e;
    });
  }
  return { pageProps: { user, ...appProps.pageProps } };
};

export default AppWrapper;
