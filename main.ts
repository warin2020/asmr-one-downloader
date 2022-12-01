import downloadByInfo from './download.ts';
import getInfos from './info.ts';

async function main() {
  if (Deno.args.length < 3) {
    console.error('no enough input');
    return;
  }
  const [name, password, rj] = Deno.args;
  const infos = await getInfos(name, password, rj);
  infos.forEach(i => downloadByInfo(i));
}

main();
