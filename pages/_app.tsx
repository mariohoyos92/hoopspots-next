import React from 'react';
import App from 'next/app';
import Router from 'next/router';
import NProgress from 'nprogress';

import 'lazysizes';
import 'lazysizes/plugins/attrchange/ls.attrchange';

import '../styles/index.css';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeError', () => NProgress.done());
Router.events.on('routeChangeComplete', () => NProgress.done());

class AppWrapper extends App<{}> {
  public render() {
    const { Component, pageProps } = this.props;

    return (
      <div id="main-body">
        <Component {...pageProps} />
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
      </div>
    );
  }
}

export default AppWrapper;
