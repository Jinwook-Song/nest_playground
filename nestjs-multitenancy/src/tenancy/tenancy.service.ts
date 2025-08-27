import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Tenants } from './tenants.inteface';
import { TenantContext } from './tenant-context.interface';

@Injectable()
export class TenancyService implements OnModuleInit {
  private tenants: Tenants;
  private readonly asyncLocalStorage = new AsyncLocalStorage<TenantContext>();

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

  runWithTenant(tenantId: string, callback: () => void) {
    this.asyncLocalStorage.run({ tenantId }, callback);
  }

  getTenantContext(): TenantContext {
    const context = this.asyncLocalStorage.getStore();
    if (!context) throw new Error('Tenant context not found');

    return context;
  }

  getTenants(): Readonly<Tenants> {
    return { ...this.tenants };
  }
}
