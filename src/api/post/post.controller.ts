import express from 'express';
import { inject, injectable } from 'inversify';
import config from '../../config';
import { PostLikeModel, PostModel } from '../../domain/interfaces/post';
import { JwtPayload } from '../../domain/interfaces/user';
import { PostService } from '../../services/post.service';
import TYPES from '../../types';
import ApiResponse from '../../utilities/api-response';
import logger from '../../utilities/logger';
import { RegistrableController } from '../registrable.controller';
import PostValidator from './post.validator';

@injectable()
export default class PostController implements RegistrableController {
  private postService: PostService;

  constructor(@inject(TYPES.PostService) postService: PostService) {
    this.postService = postService;
  }

  registerRoutes(app: express.Application): void {
    app.post(`${config.API_URL}/posts`, this.createOne);
    app.put(`${config.API_URL}/posts/:_id/like`, this.likeOne);
    app.get(`${config.API_URL}/posts/`, this.findAll);
    app.get(`${config.API_URL}/posts/:_id`, this.findOne);
  }

  createOne = async (
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> => {
    try {
      // store authenticated users id
      const { _id } = (req.user as JwtPayload).user;

      const model: PostModel = {
        ...req.body,
        // set user id using JWT token passed in header
        postedBy: _id
      };

      // validate request body
      const validity = PostValidator.createOne(model);
      if (validity.error) {
        const { message } = validity.error;
        return ApiResponse.error(res, message);
      }

      const post = await this.postService.createOne(model);

      return ApiResponse.success(res, post);
    } catch (error) {
      const { message } = error;
      logger.error(
        `[PostController: createOne] - Unable to create post: ${message}`
      );
      return ApiResponse.error(res, message);
    }
  };

  likeOne = async (
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> => {
    try {
      // store authenticated users id
      const { _id } = (req.user as JwtPayload).user;

      const model: PostLikeModel = {
        _id: req.params._id,
        user: _id
      };

      // validate request body
      const validity = PostValidator.likeOne(model);
      if (validity.error) {
        const { message } = validity.error;
        return ApiResponse.error(res, message);
      }

      const post = await this.postService.likeOne(model);

      return ApiResponse.success(res, { post });
    } catch (error) {
      const { message } = error;
      logger.error(
        `[PostController: likeOne] - Failed to like post: ${message}`
      );
      return ApiResponse.error(res, message);
    }
  };

  findAll = async (
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> => {
    try {
      const posts = await this.postService.findAll({});
      return ApiResponse.success(res, posts);
    } catch (error) {
      const { message } = error;
      logger.error(
        `[PostController: findAll] - Unable to find posts: ${message}`
      );
      return ApiResponse.error(res, error);
    }
  };

  findOne = async (
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> => {
    try {
      const { _id } = req.params;
      const post = await this.postService.findOneById(_id);
      return ApiResponse.success(res, post);
    } catch (error) {
      const message = error.message || error;
      logger.error(
        `[PostController: findOne] - Unable to find post: ${message}`
      );
      return ApiResponse.error(res, message);
    }
  };
}
