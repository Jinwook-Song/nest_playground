import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProfileService } from './profile.service';

class CreateProfileDto {
  userId!: number;
  fullName?: string;
  bio?: string;
  avatarUrl?: string;
}

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  async create(@Body() dto: CreateProfileDto) {
    return this.profileService.create(dto.userId, {
      fullName: dto.fullName,
      bio: dto.bio,
      avatarUrl: dto.avatarUrl,
    });
  }

  @Get(':userId')
  async findByUser(@Param('userId') userId: string) {
    return this.profileService.findByUser(Number(userId));
  }
}
