import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { JobsService } from './jobs.service';
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
        return this.jobsService.getJob(id);
    }

    @Post()
    createJob(@Body() createJobDto: CreateJobDto) {
        const jobId = this.jobsService.createJob(createJobDto.urls);

        return { "jobId": jobId };
    }

    @Delete(':id')
    deleteJob(@Param('id') id: string) {
        return this.jobsService.cancelJob(id);
    }
}
