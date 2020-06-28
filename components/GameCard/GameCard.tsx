import React from 'react';
import { format } from 'date-fns';
import { GameWithCourtInfo, GamesWithCourtInfo } from '../../pages/api/_repositories/game-repository';
import Card from '../Card/Card';
import Link from 'next/link';
import appRoutes from '../../types/Routes';
import { CardHeaderWithAvatars } from '../Card/CardHeader/CardHeader';

type Props = {
  game: GameWithCourtInfo;
};

export function getGameDate(game: GamesWithCourtInfo | GameWithCourtInfo) {
  return format(new Date(game.startTime), '	EEEE, MMMM do, y');
}

export function getGameTime(game: GameWithCourtInfo | GameWithCourtInfo) {
  const startTime = format(new Date(game.startTime), 'E MMM do, y ha');
  const endTime = format(new Date(game.endTime), 'ha');
  const gameTime = `${startTime} - ${endTime}`;
  return gameTime;
}

export function getGameTimeLong(game: GameWithCourtInfo | GameWithCourtInfo) {
  const startTime = format(new Date(game.startTime), 'h:mm aaa');
  const endTime = format(new Date(game.endTime), 'h:mm aaa');
  const gameTime = `${startTime} - ${endTime}`;
  return gameTime;
}

const GameCard: React.FC<Props> = ({ game }) => {
  const { rsvps, slug } = game;
  const gameTime = getGameTime(game);

  return (
    <Link href={appRoutes.gameDetails} as={`/game/${slug}`}>
      <a>
        <Card className="mb-5">
          <CardHeaderWithAvatars
            title={game.gameName}
            description={gameTime}
            avatarUrls={rsvps.map(({ profilePhotoUrl }) => profilePhotoUrl)}
          />
        </Card>
      </a>
    </Link>
  );
};

export default GameCard;
