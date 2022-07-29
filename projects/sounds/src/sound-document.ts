import { ObjectId } from 'mongodb';

export interface SoundDocument {
  _id: ObjectId;
  name: string;
  fileName: string;
}
