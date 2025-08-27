import { readFileSync } from 'fs';
import { Tenants } from './tenants.inteface';
import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { join } from 'path';

@Injectable()
export class TenancyService implements OnModuleInit {
  private tenants: Tenants;

  onModuleInit() {
    const tenants: Tenants = JSON.parse(
      readFileSync(join(__dirname, './tenants.json'), 'utf8'),
    );
    this.tenants = tenants;
  }

  validateTenantId(tenantId: string) {
    if (!this.tenants[tenantId]) {
      throw new BadRequestException(`Invalid tenant ID: ${tenantId}`);
    }
  }

  getTenants(): Readonly<Tenants> {
    return { ...this.tenants };
  }
}
