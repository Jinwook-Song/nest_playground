import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { TenancyService } from 'src/tenancy/tenancy.service';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private defaultPool: Pool;
  private readonly tenantConnections: Map<
    string,
    { pool: Pool; database: NodePgDatabase<any> }
  > = new Map();

  constructor(
    private readonly configService: ConfigService,
    private readonly tenancyService: TenancyService,
  ) {}

  async onModuleInit() {
    this.createDefaultPool();
    await this.createTenantConnections();
  }

  private async createDefaultPool() {
    this.defaultPool = new Pool({
      connectionString: this.configService.getOrThrow<string>('DATABASE_URL'),
    });
  }

  private async createTenantConnections() {
    for (const [tenantId, connectionString] of Object.entries(
      this.tenancyService.getTenants(),
    )) {
      await this.createTenantConnection(tenantId, connectionString);
    }
  }

  private async createTenantConnection(
    tenantId: string,
    connectionString: string,
  ) {
    await this.createDatabaseIfNotExists(tenantId);
    const pool = new Pool({ connectionString });
    const database = drizzle(pool, { schema: {} });
    this.tenantConnections.set(tenantId, { pool, database });
  }

  private async createDatabaseIfNotExists(tenantId: string) {
    const result = await this.defaultPool.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [tenantId],
    );

    if (result.rowCount === 0) {
      await this.defaultPool.query(`CREATE DATABASE ${tenantId}`);
    }
  }
}
