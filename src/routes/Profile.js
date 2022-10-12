import { authService, dbService } from 'fbase';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Nweet from 'components/Nweet';

const Profile = ({ userObj, refreshUser }) => {
  const history = useHistory();
  const [myNweets, setMyNweets] = useState([]);
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

  const onLogOutClick = () => {
    authService.signOut();
    history.push('/');
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await userObj.updateProfile({ displayName: newDisplayName });
      refreshUser();
    }
  };

  const getMyNweets = async () => {
    const nweets = await dbService.collection('nweets').where('creatorId', '==', userObj.uid).orderBy('createdAt', 'asc').get();
    setMyNweets(
      nweets.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      })),
    );
  };

  useEffect(() => {
    getMyNweets();
  });

  return (
    <>
      <form onSubmit={onSubmit}>
        <input onChange={onChange} type="text" placeholder="Display Name" value={newDisplayName} />
        <input type="submit" value="Update Profile" />
      </form>
      <button onClick={onLogOutClick}>Log Out</button>
      <div>
        {myNweets.map((myNweet) => (
          <Nweet key={myNweet.id} nweetObj={myNweet} isOwner={myNweet.creatorId === userObj.uid} />
        ))}
      </div>
    </>
  );
};

export default Profile;
