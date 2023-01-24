import { Storage } from 'aws-amplify';
import { atom } from 'jotai';
import { useAtomCallback } from 'jotai/utils';
import { useCallback } from 'react';
import { credAtom } from './auth';

(window as any).Storage = Storage;

const updateAtom = atom(false);

const keyToName = (key: string) => decodeURI(key.split("/").slice(2).join("/"));

export const storageListAtom = atom(async (get) => {
  const cred = get(credAtom);

  if (!cred?.identityId) {
    alert("Please Sign In");
    return undefined;
  }

  get(updateAtom);
  console.log('updated');

  const result = await Storage.list(`cognito/${cred.identityId}/`, { customPrefix: { public: '' } });
  return result.results.map(({ key, lastModified, size }) => ({ name: keyToName(key!), lastModified, size }));
});

export const storagePutAtom = atom(null, async (get, set, params: { name: string, file: Blob }) => {
  const cred = get(credAtom);

  if (!cred?.identityId) {
    alert("Please Sign In");
    return undefined;
  }

  const putResult = await Storage.put(`cognito/${cred.identityId}/${encodeURI(params.name)}`, params.file, { customPrefix: { public: '' } });
  console.log(putResult);
  set(updateAtom, !get(updateAtom));
})

export function useStorageGet() {
  return useAtomCallback(
    useCallback(async (get, _, name: string) => {
      const cred = get(credAtom);

      if (!cred?.identityId) {
        alert("Please Sign In");
        return undefined;
      }

      const result = await Storage.get(`cognito/${cred.identityId}/${encodeURI(name)}`, { download: true, customPrefix: { public: '' } });
      return result.Body as Blob;
    }, [])
  )
}