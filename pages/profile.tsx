import React from "react";
import auth0 from "../lib/auth0";
import { NextPage } from "next";
import MetaTags from "../components/MetaTags";
import { IClaims } from "@auth0/nextjs-auth0/dist/session/session";
import { getUserProfile } from "../services/user-service";
import axios from "axios";
import { accessToken } from "mapbox-gl";

const Profile: NextPage<{ user: IClaims }> = ({ user }) => {
  return (
    <>
      <MetaTags title={"home title"} description={"this is a description"} />
      <div className="container" data-testid="home-container">
        This is the user profile from {user.name}
      </div>
    </>
  );
};

Profile.getInitialProps = async ({ req, res }) => {
  if (typeof window === "undefined") {
    const response = await axios.get<IClaims>(
      "http://localhost:3000/api/auth/me"
    );

    console.log(response.data.accessToken);
    if (!response || !response.data.user) {
      res.writeHead(302, {
        Location: "/api/auth/login"
      });
      res.end();
      return;
    }
    try {
      const userProfile = await axios.get("http://localhost:3000/api/user", {
        headers: { authorization: `Bearer ${response.data.accessToken}` }
      });
    } catch (error) {
      console.log({ error });
    }

    return { user: response.data.user };
  }
};

export default Profile;
