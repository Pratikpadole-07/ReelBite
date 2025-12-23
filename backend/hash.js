const bcrypt = require("bcryptjs");

(async () => {
  const hash = "$2b$10$k/3qt5wfhHem46XEGg9lge7yt1.Y.KvwpI5.0fsCYlKFwUpNvy2AW";
  const plain = "12345678";

  const result = await bcrypt.compare(plain, hash);
  console.log(result);
})();
