export interface PostModel {
  content: string;
  replyTo?: string;
  postedBy: string;
  likes?: string[];
}

export interface PostLikeModel {
  _id: string;
  user: string;
}
