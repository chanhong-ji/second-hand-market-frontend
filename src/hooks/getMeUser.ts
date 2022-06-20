import { gql, useQuery, useReactiveVar } from '@apollo/client';
import { useEffect } from 'react';
import { getUserLogout, LoggedInVar } from '../apollo';
import { me } from '../__generated__/me';

const ME_QUERY = gql`
  query me {
    me {
      id
      name
      phone
      avatar
      followerCount
      zoneId
      zoneFirst
      zoneSecond
      zone {
        name
      }
    }
  }
`;

function GetMeUser() {
  const loggedIn = useReactiveVar(LoggedInVar);
  const { data } = useQuery<me>(ME_QUERY, { skip: !loggedIn });

  useEffect(() => {
    if (data?.me === null) getUserLogout();
  }, [data]);

  useEffect(() => {
    if (data?.me) {
      localStorage.setItem('zoneId', data?.me.zoneId + '');
    }
  }, [data]);

  return data;
}

export default GetMeUser;
