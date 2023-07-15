import {
  INestApplication,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import { isDev } from 'src/util';
dotenv.config();

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, 'query' | 'beforeExit'>
  implements OnModuleInit
{
  private logger = new Logger('Prisma');

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

    async function queryResultLogger(
      params: Prisma.MiddlewareParams,
      next: any,
    ) {
      const before = Date.now();
      const result = await next(params);
      const after = Date.now();
      const time = after - before;
      const showObjects = process.env.LOG_OBJECTS === 'true';
      this.logger.log(
        `${params.model}.${params.action} ${time}ms\n${
          showObjects ? JSON.stringify(params.args, null, 2) : null
        }\n${showObjects ? JSON.stringify(result, null, 2) : null}`,
      );
      return result;
    }
    this.$use(queryResultLogger.bind(this));
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
