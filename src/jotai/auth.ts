import { Auth } from 'aws-amplify';
import { atom, useAtomValue } from 'jotai'

const fetchAuthenticatedUser = () => Auth.currentAuthenticatedUser().catch((e) => (console.error(e), undefined));
const fetchUserCredentials = () => Auth.currentUserCredentials().catch(e => (console.error(e), undefined));

interface User {
  username: string;
}

type UserOrUndefined = User | undefined
type ICredentialsOrUndefined = Awaited<ReturnType<typeof Auth.currentUserCredentials>> | undefined

export const authAtom = atom<Promise<UserOrUndefined> | UserOrUndefined>(fetchAuthenticatedUser());
export const credAtom = atom<Promise<ICredentialsOrUndefined> | ICredentialsOrUndefined>(fetchUserCredentials());

export const signInAtom = atom(null, async (_, set, param: { email: string; password: string }) => {
  const result = await Auth.signIn(param.email, param.password);
  set(authAtom, result);
  set(credAtom, fetchUserCredentials());
})

export const signOutAtom = atom(null, async (_, set) => {
  await Auth.signOut();
  set(authAtom, undefined);
  set(credAtom, undefined);
})

export function AuthPreloader() {
  useAtomValue(authAtom);
  useAtomValue(credAtom);
  return null;
}
