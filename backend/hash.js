const bcrypt = require("bcryptjs");
const hashed = bcrypt.hashSync("test123", 10);
console.log(hashed);
