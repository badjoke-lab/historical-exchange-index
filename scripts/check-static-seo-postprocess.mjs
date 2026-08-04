import { spawnSync } from 'node:child_process';

const result = spawnSync(process.execPath, ['scripts/localize-static-html.mjs', '--self-test'], {
  cwd: process.cwd(),
  encoding: 'utf8',
});
if (result.status !== 0) {
  process.stderr.write(result.stdout ?? '');
  process.stderr.write(result.stderr ?? '');
  process.exit(result.status ?? 1);
}
process.stdout.write(result.stdout);
