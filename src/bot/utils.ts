import { promises as fs } from 'fs';
import SoundFile from './sound-file';

export function loadFiles(directory: string): Promise<SoundFile[]> {
  return fs.readdir(directory, { withFileTypes: true }).then(files => files.map(x => splitFileName(x.name)));
}

export function checkFileExtension(fileName: string, allowedExtensions: string[]): boolean {
  return allowedExtensions.some(ext => fileName.endsWith(ext));
}

export function splitFileName(name: string): SoundFile {
  const fullName = name.toLowerCase();
  const splitName = fullName.split('.');

  return {
    name: splitName.slice(0, splitName.length - 1).join('.'),
    type: splitName[splitName.length - 1],
    fullName
  };
}

export function pickRandom<T>(collection: T[]): T {
  return collection[Math.floor(Math.random() * collection.length)];
}
