import React from 'react';
import { format } from 'date-fns';
import { GameWithCourtInfo } from '../../pages/api/_repositories/game-repository';
import Card from '../Card/Card';
import Link from 'next/link';
import appRoutes from '../../types/Routes';
import { CardHeaderWithAvatars } from '../Card/CardHeader/CardHeader';

type Props = {
  game: GameWithCourtInfo;
};

function getGameTime(game: GameWithCourtInfo) {
  const startTime = format(new Date(game.startTime), 'E MMM do, y ha');
  const endTime = format(new Date(game.endTime), 'ha');
  const gameTime = `${startTime} - ${endTime}`;
  return gameTime;
}

const GameCard: React.FC<Props> = ({ game }) => {
  const { description, courtDetails, rsvps, slug } = game;
  const gameTime = getGameTime(game);
  const court = courtDetails[0];

  return (
    <Link href={appRoutes.gameDetails} as={`/game/${slug}`}>
      <a>
        <Card className="mb-5">
          <CardHeaderWithAvatars
            title={game.gameName}
            description={gameTime}
            avatarUrls={rsvps.map(({ profilePhotoUrl }) => profilePhotoUrl)}
          />
          {/* <CardBody>
            <CardInfo>
              <CardInfoSection isFirst title="Court name">
                {court.courtName}
              </CardInfoSection>
              <CardInfoSection title="Court address">{court.geoLocationData.placeName}</CardInfoSection>
              <CardInfoSection title="Hoopers going">
                {rsvps.map(r => (
                  <p>{r.name}</p>
                ))}
              </CardInfoSection>
            </CardInfo>
          </CardBody> */}
        </Card>
      </a>
    </Link>
  );
};

export default GameCard;
