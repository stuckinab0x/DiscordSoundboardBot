export interface SoundFile {
  name: string;
  extension: string;
  fullName: string;
}

export interface Sound {
  name: string;
  file: SoundFile;
}
