import fs from "fs";
import path from "path";

export const DeleteFile = (fileLInk: any) => {
  console.log("Delete File");
  const fileName = fileLInk.split("/").pop();
  const relativePath = `./uploads`;
  const filePath = path.join(__dirname, "../", relativePath, fileName);

  console.log("file path :", filePath);
  if (!fs.existsSync(filePath)) {
    console.log("File does not exist");
    return;
  }
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error :", err);
    } else {
      console.log("Successfully Deleted!");
    }
  });
};
