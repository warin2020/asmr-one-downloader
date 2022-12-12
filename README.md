# asmr.one自动下载

运行：
* 装deno：[Installation | Manual | Deno](https://deno.land/manual@v1.28.2/getting_started/installation)
* 跑deno：`deno run --allow-read --allow-write --allow-net main.ts 用户名 密码 rj号`
* 下载完会存到`./download/rj号`文件夹

注意：
* 如果卡住了需要给终端开下梯子：`export HTTPS_PROXY=你梯子的proxy`
* 可以在根目录新建`.pathignore`文件，里面每行写一个不想下载的文件路径子字符串，比如：
  ```
  .wav
  .mp4
  SE無し
  おまけ
  ```
