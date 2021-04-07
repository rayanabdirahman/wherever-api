export interface PostModel {
  content: string;
  postedBy: string;
  likes?: string[];
}

export interface PostLikeModel {
  _id: string;
  user: string;
}
