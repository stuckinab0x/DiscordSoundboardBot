export default interface Sound {
  id: string;
  name: string;
  date: string;
  url: string;
  isFavorite: boolean;
  isIntroSound: boolean;
  volume?: number;
}
