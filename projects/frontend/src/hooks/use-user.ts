import cookies from 'js-cookie';
import User from '../models/user';

const user: User = {
  id: cookies.get('userid')!,
  name: cookies.get('username')!,
  avatarId: cookies.get('avatar')!,
};

const useUser = (): User => user;

export default useUser;
