import fs from 'fs';
import path from 'path';

const dogsFolderPath = path.resolve(path.join(process.cwd(), 'public', 'img', 'dogs'));

function getImagePaths(folderPath) {
  return new Promise((resolve, reject) => {
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        reject(err);
      } else {
        const imagePaths = files.map((file) => path.join(folderPath.split('public')[1], file));
        resolve(imagePaths);
      }
    });
  });
}

const images = await getImagePaths(dogsFolderPath);

export default images;
