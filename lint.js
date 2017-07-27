
const exec = require('child_process').exec;

const jsFiles = [
  'src/index.js',
  'src/routes.js',
  'src/actions/*.js',
  'src/components/**/*.js',
  'src/reducers/*.js',
  'src/store/*.js',
  'src/utils/*.js'
];
jsFiles.forEach((filePath) => {
  exec(`eslint ${filePath} --cache -f table --color --ignore-pattern .gitignore`, {
    env: process.env,
    stdio: [0, 1, 2]
  }, (err, stdout) => {
    console.log(`文件 ${filePath} 的检查结果:`);
    console.log(`${stdout}`);
  }).once('close', (code) => {
    if (code) {
      console.log('eslint代码规范检查有错，请前往检查！');
      process.exit(1);
    }
  });
});

