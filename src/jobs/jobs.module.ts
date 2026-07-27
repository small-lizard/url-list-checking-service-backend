import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { InMemoryJobsRepository } from './repositories/InMemoryJobsRepository';

@Module({
	controllers: [JobsController],
	providers: [JobsService, InMemoryJobsRepository],
})
export class JobsModule { }
