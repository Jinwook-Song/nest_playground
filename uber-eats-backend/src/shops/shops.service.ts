import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shop } from './entities/shop.entity';

@Injectable()
export class ShopsService {
  constructor(
    @InjectRepository(Shop)
    private readonly shopRepository: Repository<Shop>,
  ) {}

  async findAll(): Promise<Shop[]> {
    return this.shopRepository.query('SELECT * FROM shop');
  }

  async findOne(id: number): Promise<Shop> {
    return this.shopRepository.findOne({ where: { id } });
  }

  async create(shop: Shop): Promise<Shop> {
    return this.shopRepository.save(shop);
  }

  async update(id: number, shop: Shop): Promise<Shop> {
    await this.shopRepository.update(id, shop);
    return this.shopRepository.findOne({ where: { id } });
  }

  async delete(id: number): Promise<void> {
    await this.shopRepository.delete(id);
  }
}
