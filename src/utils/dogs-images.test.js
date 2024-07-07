import fs from 'fs';
import { describe, it, expect, vi } from 'vitest';
import { getImagePaths, getDogsFolderPath, loadImages } from './dogs-images.js';

vi.mock('fs');

describe('getDogsFolderPath', () => {
  it('should return the correct path', () => {
    const path = getDogsFolderPath();
    expect(path).toContain('/public/img/dogs');
  });
});

describe('getImagePaths', () => {
  it('should resolve with image paths', async () => {
    fs.readdir.mockImplementation((path, callback) => {
      if (path === '/fake/public/path') {
        callback(null, ['image1.jpg', 'image2.jpeg', 'not_an_image.txt']);
      } else {
        callback(new Error('Failed to read directory'), null);
      }
    });

    const paths = await getImagePaths('/fake/public/path');
    expect(paths).toEqual(['/path/image1.jpg', '/path/image2.jpeg']);
  });

  it('should reject on error', async () => {
    fs.readdir.mockImplementation((path, callback) => {
      callback(new Error('Failed to read directory'), null);
    });

    try {
      await getImagePaths('/invalid/path');
      throw new Error('Test should have thrown an error');
    } catch (error) {
      expect(error.message).toBe('Failed to read directory');
    }
  });
});

describe('loadImages', () => {
  it('should handle image loading', async () => {
    fs.readdir.mockImplementation((path, callback) => {
      callback(null, ['dog1.jpg', 'dog2.jpeg']);
    });

    const images = await loadImages();
    expect(images.length).toBe(2);
    expect(images).toStrictEqual([
      { path: '/img/dogs/dog1.jpg', name: 'dog1' },
      { path: '/img/dogs/dog2.jpeg', name: 'dog2' },
    ]);
  });

  it('should handle errors gracefully', async () => {
    fs.readdir.mockImplementation((path, callback) => {
      callback(new Error('Failed to read directory'), null);
    });

    const images = await loadImages();
    expect(images).toEqual([]);
  });
});
