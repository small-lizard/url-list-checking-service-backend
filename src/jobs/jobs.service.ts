import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { InMemoryJobsRepository } from './repositories/InMemoryJobsRepository';

@Injectable()
export class JobsService {
    constructor(private jobsRepository: InMemoryJobsRepository) { }     

    public createJob(urls: string[]) {
        const jobId = randomUUID();
        const job = this.jobsRepository.save(jobId, urls);

        job.process();

        return jobId;
    }

    public getJob(jobId: string) {
        const job = this.jobsRepository.get(jobId);
        if (!job) {
            throw new NotFoundException(`No job with the ID ${jobId} found`);
        }

        const jobSummary = {
            jobId: job.jobId,
            createdAt: job.createdAt,
            status: job.status,
            totalUrls: job.urls.length,
            successCount: job.urls.filter((url) => url.status === 'success').length,
            errorCount: job.urls.filter((url) => url.status === 'error').length,
            urls: job.urls,
        };

        return jobSummary;
    }

    public getAllJobs() {
        const jobsArray = this.jobsRepository.getAll();

        const jobsSummary = jobsArray.map((job) => {
            return {
                jobId: job.jobId,
                createdAt: job.createdAt,
                status: job.status,
                totalUrls: job.urls.length,
                successCount: job.urls.filter((url) => url.status === 'success').length,
                errorCount: job.urls.filter((url) => url.status === 'error').length,
            };
        });

        return jobsSummary;
    }

    public cancelJob(jobId: string) {
        const job = this.jobsRepository.get(jobId);
        if (!job) {
            throw new NotFoundException(`No job with the ID ${jobId} found`);
        }

        job.cancel();

        return { message: 'Job cancelled' };
    }
}
