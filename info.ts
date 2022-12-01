export type Info = ({
  type: 'audio' | 'image' | 'text';
  mediaDownloadUrl: string;
} | {
  type: 'folder';
  children: Info[];
}) & {
  title: string;
};

async function getToken(name: string, password: string): Promise<string> {
  const { token } = await fetch('https://api.asmr.one/api/auth/me', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name,
      password
    })
  }).then(response => response.json());
  return token;
}

export default async function getInfos(name: string, password: string, rj: string): Promise<Info[]> {
  const token = await getToken(name, password);

  const infos = await fetch(`https://api.asmr.one/api/tracks/${rj}`, {
    method: 'GET',
    headers: {
      authorization: `Bearer ${token}`
    }
  }).then(response => response.json());

  return infos;
}
