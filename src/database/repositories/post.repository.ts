import { injectable } from 'inversify';
import { PostModel } from '../../domain/interfaces/post';
import Post, { PostDocument } from '../models/post.model';

export interface PostRepository {
  createOne(model: PostModel): Promise<PostDocument>;
  findById(_id: string): Promise<PostDocument | null>;
  findOneByIdAndUpdate(
    _id: string,
    key: string,
    value: string,
    option?: string
  ): Promise<PostDocument | null>;
  findAll(query: { [key: string]: string }): Promise<PostDocument[] | null>;
}

@injectable()
export class PostRepositoryImpl implements PostRepository {
  async createOne(model: PostModel): Promise<PostDocument> {
    const post = new Post(model);
    await post.save();
    return post.populate('postedBy').execPopulate();
  }

  async findById(_id: string): Promise<PostDocument | null> {
    return await Post.findOne({ _id }).select('-__v');
  }

  async findOneByIdAndUpdate(
    _id: string,
    key: string,
    value: string,
    option?: string
  ): Promise<PostDocument | null> {
    // give function flexibility to add or remove values from arrays
    // check if array key is being updated
    if (option)
      return await Post.findByIdAndUpdate(
        _id,
        { [option]: { [key]: value } },
        {
          new: true
        }
      );
    return await Post.findByIdAndUpdate(
      _id,
      { key: value },
      {
        new: true
      }
    );
  }

  async findAll(query: {
    [key: string]: string;
  }): Promise<PostDocument[] | null> {
    // return all posts or filter by postedBy
    return await Post.find(query)
      .populate('postedBy', ['-password'])
      .sort({ createdAt: -1 });
  }
}
