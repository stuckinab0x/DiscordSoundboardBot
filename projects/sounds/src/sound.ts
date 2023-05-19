export interface SoundFile {
  name: string;
  extension: string;
  fullName: string;
}

export interface Sound {
  id: string;
  name: string;
  file: SoundFile;
  createdAt: Date;
  volume?: string;
}
