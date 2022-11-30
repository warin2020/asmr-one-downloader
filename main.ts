import * as path from "https://deno.land/std/path/mod.ts";
import * as fs from "https://deno.land/std/fs/mod.ts"
import ConcurrenceLimiter from './ConcurrenceLimiter.ts';

type Info = ({
  type: 'audio' | 'image' | 'text';
  mediaDownloadUrl: string;
} | {
  type: 'folder';
  children: Info[];
}) & {
  title: string;
};

async function writeFileByPath(filePath: string, data: Uint8Array) {
  await Deno.mkdir(path.dirname(filePath), { recursive: true });
  await Deno.writeFile(filePath, data);
}

async function main() {
  const content = await Deno.readTextFile(Deno.args[0]);
  const info: Info[] = JSON.parse(content);

  const limiter = new ConcurrenceLimiter<void>(4);
  function dfs(info: Info, curPath = 'download') {
    curPath = path.join(curPath, info.title);
    if (info.type === 'folder') {
      info.children.forEach(child => dfs(child, curPath));
    } else {
      fs.exists(curPath).then((existed) => {
        if (!existed) {
          limiter.add(
            () => {
              console.log(`start download: ${curPath}`);
              return fetch(info.mediaDownloadUrl)
                .then(response => response.arrayBuffer())
                .then((data) => {
                  console.log(`success download: ${curPath}`);
                  const d = new Uint8Array(data);
                  writeFileByPath(curPath, d);
                });
            }
          );
        }
      });
    }
  }
  info.forEach(i => dfs(i));
}

await main();
