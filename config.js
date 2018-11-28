module.exports = {
  methods: ["readFile", "writeFile", "stat", "readdir"],
  fileFilter: [/^\S+\.js$/i, /^\S+\.html$/i]
};
