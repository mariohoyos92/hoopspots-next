import React from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import MetaTags from "../../components/MetaTags";

const GameFinder: NextPage = () => {
  const router = useRouter();
  return (
    <>
      <MetaTags title={"home title"} description={"this is a description"} />
      <div className="container" data-testid="home-container">
        <h1>Pickup Games in {router.query.placeName}</h1>
      </div>
    </>
  );
};

export default GameFinder;
