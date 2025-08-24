import { PickType } from '@nestjs/mapped-types';
import { CreatePostRequest } from './create-post.request';

export class UpdatePostRequest extends PickType(CreatePostRequest, ['title', 'content']) {}
