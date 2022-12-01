import * as path from "https://deno.land/std@0.166.0/path/mod.ts";
import * as fs from "https://deno.land/std@0.166.0/fs/mod.ts"
import ConcurrenceLimiter from './ConcurrenceLimiter.ts';
import { Info } from './info.ts';

async function writeFileByPath(filePath: string, data: Uint8Array) {
  await Deno.mkdir(path.dirname(filePath), { recursive: true });
  await Deno.writeFile(filePath, data);
}

const limiter = new ConcurrenceLimiter<void>(4);

export default function downloadByInfo(info: Info, curPath = 'download') {
  curPath = path.join(curPath, info.title);
  if (info.type === 'folder') {
    info.children.forEach(child => downloadByInfo(child, curPath));
  } else {
    fs.exists(curPath).then((existed) => {
      if (!existed) {
        limiter.add(
          () => {
            console.log(`start download: ${curPath}`);
            return fetch(info.mediaDownloadUrl)
              .then(response => response.arrayBuffer())
              .then((data) => {
                const d = new Uint8Array(data);
                writeFileByPath(curPath, d);
                console.log(`success download: ${curPath}`);
              });
          }
        );
      }
    });
  }
}
