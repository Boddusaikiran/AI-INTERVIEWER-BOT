export interface Meme {
  id: string;
  url: string;
  title: string;
  tags: string[];
  createdAt: Date;
}

export interface MemeFormData {
  title: string;
  url: string;
  tags: string[];
}