import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import pLimit from 'p-limit';

export namespace JobsService {
    export type Job = {
        jobId: string;
        status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'failed';
        createdAt: Date;
        urls: Array<URLProcessingJob>;
    }

    export type URLProcessingJob = {
        url: string;
        status: 'pending' | 'in_progress' | 'success' | 'error' | 'cancelled';
        httpStatus?: number;
        errorMessage?: string;
        startTime?: Date;
        endTime?: Date;
        duration?: number;
    }
}

@Injectable()
export class JobsService {
    private jobs = new Map<string, JobsService.Job>();

    public getJob(jobId: string) {
        const job = this.jobs.get(jobId);
        if (!job) {
            return null;
        }
        return job;
    }

    public getAllJobs() {
        const jobsArray = Array.from(this.jobs.values());
        const jobsSummary = jobsArray.map(job => {
            return {
                jobId: job.jobId,
                createdAt: job.createdAt,
                status: job.status,
                totalUrls: job.urls.length,
                successCount: job.urls.filter(url => url.status === 'success').length,
                errorCount: job.urls.filter(url => url.status === 'error').length
            }
        });

        return jobsSummary;
    }

    public cancelJob(jobId: string) {
        const job = this.jobs.get(jobId);
        if (!job) {
            return { message: "Job not found" };
        }

        job.status = 'cancelled';

        job.urls.forEach(url => {
            if (url.status === 'pending' || url.status === 'in_progress') {
                url.status = 'cancelled';
            }
        });
    }

    public createJob(urls: string[]) {
        const jobId = randomUUID();

        const job: JobsService.Job = {
            jobId,
            status: 'pending',
            createdAt: new Date(),
            urls: urls.map(url => ({
                url,
                status: 'pending'
            }))
        };

        this.jobs.set(jobId, job);

        this._processJob(jobId);

        return jobId;
    }

    private _processOneUrl(url: JobsService.URLProcessingJob) {
        url.startTime = new Date();
        url.status = 'in_progress';
        return fetch(url.url, { method: 'HEAD' });
    }

    private _processJob(jobId: string) {
        const limit = pLimit(5);
        const job = this.jobs.get(jobId);
        if (!job) {
            return null;
        }
        
        job.status = 'in_progress';

        const requests = job.urls.map(url => {
            return limit(() => this._processOneUrl(url));
        });

        Promise.allSettled(requests)
            .then((responses) => {
                return Promise.all(
                    responses.map((response, index) => {
                        return new Promise<void>((resolve) => {
                            const delay = Math.floor(Math.random() * 10000);
                            const url = job.urls[index];
                            setTimeout(() => {
                                if (response.status === 'fulfilled') {
                                    url.status = 'success';
                                    url.httpStatus = response.value.status;
                                } else {
                                    url.status = 'error';
                                    url.errorMessage = response.reason.message;
                                }
                                url.endTime = new Date();
                                url.duration = url.endTime.getTime() - url.startTime!.getTime();
                                resolve();
                            }, delay);
                        });
                    })
                )
            })
            .finally(() => {
                const allSuccess = job.urls.every(url => url.status === 'success');
                job.status = allSuccess ? 'completed' : 'failed';
            });
    }
}
