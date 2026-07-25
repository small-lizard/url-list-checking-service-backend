import { Controller, Get, Post, Delete, Param, ParseIntPipe } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { Body } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';

@Controller('jobs')
export class JobsController {
    constructor(private jobsService: JobsService) { }

    @Get()
    getAllJobs() {
        return this.jobsService.getAllJobs();
    }

    @Get(':id')
    getJob(@Param('id') id: string) {
        const job = this.jobsService.getJob(id);
        if (!job) {
            return { message: 'Job not found' };
        }
        return job;
    }

    @Post()
    async createJob(@Body() createJobDto: CreateJobDto) {
        const jobId = await this.jobsService.createJob(createJobDto.urls);

        return { "jobId": jobId };
    }

    @Delete(':id')
    deleteJob(@Param('id') id: string) {
        return this.jobsService.cancelJob(id);
    }
}