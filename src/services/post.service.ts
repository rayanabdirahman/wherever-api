import { injectable, inject } from 'inversify';
import { PostRepository } from '../database/repositories/post.repository';
import { PostDocument } from '../database/models/post.model';
import { PostLikeModel, PostModel } from '../domain/interfaces/post';
import TYPES from '../types';
import logger from '../utilities/logger';
import { UserRepository } from '../database/repositories/user.repository';

export interface PostService {
  createOne(model: PostModel): Promise<PostDocument>;
  findOneById(_id: string): Promise<PostDocument | null>;
  findAll(query: { [key: string]: string }): Promise<PostDocument[] | null>;
  likeOne(model: PostLikeModel): Promise<PostDocument | null>;
}

@injectable()
export class PostServiceImpl implements PostService {
  private postRepository: PostRepository;
  private userRepository: UserRepository;

  constructor(
    @inject(TYPES.PostRepository) postRepository: PostRepository,
    @inject(TYPES.UserRepository) userRepository: UserRepository
  ) {
    this.postRepository = postRepository;
    this.userRepository = userRepository;
  }

  private async doesPostExist(_id: string): Promise<boolean> {
    const post = await this.postRepository.findById(_id);
    if (!post) {
      return Promise.resolve(false);
    }

    return Promise.resolve(true);
  }

  private async hasUserLikedPost(model: PostLikeModel): Promise<boolean> {
    const user = await this.userRepository.findOneById(model.user);
    if (!user) {
      throw new Error('User cannot be found');
    }

    // check if user has liked this post
    return user.likes.includes(model._id as never)
      ? Promise.resolve(true)
      : Promise.resolve(false);
  }

  async createOne(model: PostModel): Promise<PostDocument> {
    try {
      // check if post is a reply
      if (model.replyTo) {
        // check if post being replied to exists
        const isReplyToPostIdValid = await this.doesPostExist(model.replyTo);
        if (!isReplyToPostIdValid) {
          throw new Error('Post being replied to does not exist');
        }

        // create comment
        const post = await this.postRepository.createOne(model);

        // add post id into the comment array of the replied to post
        await this.postRepository.findOneByIdAndUpdate(
          model.replyTo,
          'comments',
          post._id as never,
          '$addToSet'
        );

        return post;
      }

      return await this.postRepository.createOne(model);
    } catch (error) {
      logger.error(
        `[PostService: createOne]: Unabled to create new post: ${error}`
      );
      throw error;
    }
  }

  async findOneById(_id: string): Promise<PostDocument | null> {
    try {
      const post = await this.postRepository.findById(_id);
      return post;
    } catch (error) {
      logger.error(`[PostService: findOne]: Unable to find post: ${error}`);
      throw error;
    }
  }

  async findAll(query: {
    [key: string]: string;
  }): Promise<PostDocument[] | null> {
    try {
      // return all posts or filter by postedBy
      const posts = await this.postRepository.findAll(query);
      return posts;
    } catch (error) {
      logger.error(`[PostService: findAll]: Unable to find posts: ${error}`);
      throw error;
    }
  }

  async likeOne(model: PostLikeModel): Promise<PostDocument | null> {
    try {
      const userHasLiked = await this.hasUserLikedPost(model);

      // add or remove post from users likes array
      await this.userRepository.findOneByIdAndUpdate(
        model.user,
        'likes',
        model._id,
        userHasLiked ? '$pull' : '$addToSet'
      );

      // add or remove user from post likes array
      return await this.postRepository.findOneByIdAndUpdate(
        model._id,
        'likes',
        model.user,
        userHasLiked ? '$pull' : '$addToSet'
      );
    } catch (error) {
      logger.error(`[PostService: likeOne]: Unable to like post: ${error}`);
      throw error;
    }
  }
}
