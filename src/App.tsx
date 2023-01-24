import { useAtomValue, useSetAtom } from "jotai"
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { authAtom, credAtom, signInAtom, signOutAtom } from "./jotai/auth";
import { storageListAtom, storagePutAtom, useStorageGet } from "./jotai/storage";

export function App() {
  const auth = useAtomValue(authAtom);
  const cred = useAtomValue(credAtom);
  console.log(auth, cred);

  if (!auth) {
    return <SignInForm />
  }

  return (
    <div>
      <SignOutForm />
      <MainView />
    </div>
  )
}

function MainView() {
  const list = useAtomValue(storageListAtom)!;
  const put = useSetAtom(storagePutAtom);

  const fileRef = useRef<HTMLInputElement>(null);
  const handleFileSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (fileRef.current?.files) {
      const name = fileRef.current.files[0].name;
      console.log('name', name);
      if (!name) {
        return;
      }
      const file = fileRef.current.files[0];
      put({ name, file });
    }
  }, [])

  const [imgSrc, setImgSrc] = useState<string>();
  const storageGet = useStorageGet();
  const openFile = useCallback(async (name: string) => {
    if (imgSrc) {
      URL.revokeObjectURL(imgSrc);
    }

    const blob = await storageGet(name);
    if (blob) {
      setImgSrc(URL.createObjectURL(blob));
    } else {
      setImgSrc(undefined);
    }
  }, [imgSrc])

  return (
    <div>
      <form onSubmit={handleFileSubmit}>
        <input type="file" ref={fileRef} />
        <button type="submit">Upload</button>
      </form>
      <ul>
        {list.map(item => (
          <li key={item.name}>
            <span>{item.name} ({item.size}, {item.lastModified?.toLocaleDateString()})</span>
            <button type="button" onClick={() => openFile(item.name)}>Open File</button>
          </li>
        ))}
      </ul>
      {imgSrc && <img src={imgSrc} />}
    </div>
  )
}

function SignInForm() {
  const signIn = useSetAtom(signInAtom);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    signIn({ email, password });
  }, [email, password]);

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email:
        <input type="text" value={email} onChange={e => setEmail(e.target.value)} />
      </label>
      <label>
        Password:
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      </label>
      <button type="submit">Sign In</button>
    </form>
  );
}

function SignOutForm() {
  const signOut = useSetAtom(signOutAtom);
  const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    signOut();
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Sign Out</button>
    </form>
  );
}