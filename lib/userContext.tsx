import React, { ReactNode } from 'react';

import { UserRequestedDoc } from '../pages/api/_models/user-model';

type UserContext = {
  user?: UserRequestedDoc;
};

const UserContext = React.createContext<UserContext>({
  user: null,
});

type Props = { children: ReactNode; user?: UserRequestedDoc };

export const UserProvider: React.FC<Props> = ({ children: child, user }) => {
  return (
    <UserContext.Provider
      value={{
        user,
      }}
    >
      {child}
    </UserContext.Provider>
  );
};

export const { Consumer: UserConsumer } = UserContext;

export default UserContext;
