import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import { isDev } from 'src/util';
dotenv.config();

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, 'query' | 'beforeExit'>
  implements OnModuleInit
{
  constructor() {
    const dbUrl = isDev
      ? process.env.MYSQL_URL_DEV
      : process.env.MYSQL_URL_PROD;
    super({
      datasources: { db: { url: dbUrl } },
    });

    this.$on('query', function queryEventLogger(event: Prisma.QueryEvent) {
      console.log('Query: ' + event.query);
      console.log('Params: ' + event.params);
      console.log('Duration: ' + event.duration + 'ms');
      console.log('Timestamp: ' + event.timestamp + 'ms');
    });

    this.$use(async function queryResultLogger(
      params: Prisma.MiddlewareParams,
      next,
    ) {
      const before = Date.now();
      const result = await next(params);
      const after = Date.now();
      const time = after - before;
      console.log(
        `Database 1/2 | ${params.model}.${params.action}\n${
          process.env.LOG_OBJECTS ? JSON.stringify(params.args, null, 2) : null
        }`,
      );
      console.log(
        `Database 2/2 | ${time}ms\n${
          process.env.LOG_OBJECTS ? JSON.stringify(result, null, 2) : null
        }`,
      );
      console.trace();
      return result;
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
