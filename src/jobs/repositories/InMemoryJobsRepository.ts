import { Injectable } from '@nestjs/common';
import { Job } from '../models/Job';
import { URLChecker } from '../models/UrlChecker';
import { Repository } from '../types';

@Injectable()
export class InMemoryJobsRepository implements Repository<Job> {
    private _jobs = new Map<string, Job>();

    get(jobId: string): Job | undefined {
        return this._jobs.get(jobId);
    }

    getAll(): Job[] {
        return Array.from(this._jobs.values());
    }

    save(jobId: string, urls: string[]): Job {
        const job: Job = new Job(
            jobId,
            urls.map((url) => new URLChecker(url)),
        );

        this._jobs.set(job.jobId, job);

        return job;
    }
}
