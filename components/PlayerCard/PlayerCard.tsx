import React from 'react';
import Card from '../Card/Card';
import CardBody from '../Card/CardBody';
import Avatar from '../Avatar';
import Link from 'next/link';

type Props = {
  name: string;
  imageUrl: string;
  height?: string;
  position?: string;
  playsLike?: string;
  className?: string;
};

const PlayerCard: React.FC<Props> = ({ name, imageUrl, height, position, className }) => {
  return (
    <div className={`player-card inline-block ${className}`}>
      <Link href={`/profile/${name}`}>
        <a>
          <Card>
            <CardBody>
              <div className="flex flex-col justify-center items-center">
                <Avatar imageUrl={imageUrl} />
                <div className="font-bold">{name}</div>
                <div className="text-gray-500 text-sm text-center">
                  {height ? height : null}
                  <br />
                  {position ? position : null}
                  {/* {playsLike ? <div className="text-center text-gray-400">Plays like: {playsLike}</div> : null} */}
                </div>
              </div>
            </CardBody>
          </Card>
        </a>
      </Link>
      <style jsx>{`
        .player-card {
          max-width: 190px;
          min-width: 160px;
        }
      `}</style>
    </div>
  );
};

export default PlayerCard;
