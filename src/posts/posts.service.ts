import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { CreatePostDto } from './create-post.dto';
import { UpdatePostDto } from './update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async findAll(): Promise<Post[]> {
    return this.postRepository.find();
  }

  async findOne(id: string): Promise<Post | null> {
    return this.postRepository.findOneBy({ id });
  }

  async create(createPostDto: CreatePostDto, userId: number): Promise<Post> {
    const post = await this.postRepository.create({
      ...createPostDto,
      userId,
    });
    return this.postRepository.save(post);
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post | null> {
    const post = await this.postRepository.preload({ id, ...updatePostDto });
    if (!post) {
      return null;
    }
    return this.postRepository.save(post);
  }

  async remove(id: string): Promise<Post | null> {
    const post = await this.findOne(id);
    if (!post) {
      return null;
    }
    return this.postRepository.remove(post);
  }
}
