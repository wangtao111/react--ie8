const exec = require('child_process').exec;

const child = exec('npm run lint');

child.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});
// child.stderr.on('data', (data) => {
//   console.log(`stdout: ${data}`);
// });
child.on('close', (code) => {
  console.log(`closing code: ${code}`);
});
