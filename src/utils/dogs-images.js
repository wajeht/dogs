import fs from 'node:fs';
import path from 'node:path';

export function getDogsFolderPath() {
  return path.resolve(path.join(process.cwd(), 'public', 'img', 'dogs'));
}

export function getImagePaths(folderPath) {
  return new Promise((resolve, reject) => {
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        reject(err);
        return;
      }
      try {
        const basePath = folderPath.split('public')[1] || '';
        const imagePaths = files
          .map((file) => path.join(basePath, file))
          .filter((img) => img.endsWith('.jpg') || img.endsWith('.jpeg'));
        resolve(imagePaths);
      } catch (error) {
        reject(new Error('Error processing image paths: ' + error.message));
      }
    });
  });
}

export async function loadImages() {
  const folderPath = getDogsFolderPath();
  try {
    return (await getImagePaths(folderPath)).map((image) => ({
      path: image,
      name: path.basename(image, path.extname(image)),
    }));
  } catch (error) {
    console.error('Failed to load images:', error);
    return [];
  }
}
