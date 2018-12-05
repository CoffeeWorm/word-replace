const method2Promise = require("./method2Promise");
const config = require("./config");
const path = require("path");
const process = require("process");
const program = require("commander");

program
  .version("0.1.0")
  .option("-p, --path [value]", "Add directory")
  .option("-t, --targetWord [value]", "Add target word")
  .option("-w, --replaceWord [value]", "Add be replaced word")
  .parse(process.argv);
if (!(program.path && program.targetWord && program.replaceWord)) {
  console.log(
    `There must have 3 arguments!\r\nFor example:\r\n
    \tnode readdir.js -p <target path> -t <target word> -w <replace word>
    \r\nP.S. -t supports RegExp
    `
  );
  process.exit();
}
console.log(`Begin to replace ${program.path} text!`);

let fsPromises = {};
method2Promise(fsPromises, config.methods);

let filter = (name, arr) => {
  for (let reg of arr) {
    if (reg.test(name)) {
      return true;
    }
  }
  return false;
};

let replace = async url => {
  let fileNames = await fsPromises.readdir(url);
  console.log(`${url} includes [${fileNames}]`);

  for (let name of fileNames) {
    console.log(name);
    let filePath = path.join(url, name);
    let stat = await fsPromises.stat(filePath);

    if (stat.isFile()) {
      let content;
      if (!filter(name, config.fileFilter)) {
        continue;
      }

      content = await fsPromises.readFile(filePath);
      content = content.toString("utf-8");

      console.log(`Begin to replca ${filePath},\r\ncontent:\r\n${content}`);
      content = content.replace(
        new RegExp(program.targetWord, "g"),
        program.replaceWord
      );

      console.log(`write in file ${filePath},\r\ncontent:\r\n${content}`);
      await fsPromises.writeFile(filePath, content);
    }

    if (stat.isDirectory()) {
      replace(filePath);
    }
  }
};

replace(program.path);
