import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Job } from './models/job.model';
import { URLChecker } from './models/url-checker.model';

@Injectable()
export class JobsService {
    private _jobs = new Map<string, Job>();

    public createJob(urls: string[]) {
        const jobId = randomUUID();

        const job: Job = new Job(
            jobId,
            urls.map((url) => new URLChecker(url)),
        );

        this._jobs.set(jobId, job);

        job.process();

        return jobId;
    }

    public getJob(jobId: string) {
        const job = this._jobs.get(jobId);
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
        const jobsArray = Array.from(this._jobs.values());

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
        const job = this._jobs.get(jobId);
        if (!job) {
            throw new NotFoundException(`No job with the ID ${jobId} found`);
        }

        job.cancel();

        return { message: 'Job cancelled' };
    }
}
