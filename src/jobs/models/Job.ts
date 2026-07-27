import { URLChecker } from './UrlChecker';

export class Job {
    jobId: string;
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'failed';
    createdAt: Date;
    urls: Array<URLChecker>;

    private _queue: Array<URLChecker> = [];
    private readonly _limit = 5;

    constructor(jobId: string, urls: Array<URLChecker>) {
        this.jobId = jobId;
        this.status = 'pending';
        this.createdAt = new Date();
        this.urls = urls;
    }

    public process() {
        this._queue = [...this.urls];
        this.status = 'in_progress';

        const requests = Array.from({ length: this._limit }, () =>
            this._urlsHandler(),
        );

        Promise.allSettled(requests).finally(() => {
            if (this.status === 'cancelled') {
                return;
            }

            const allSuccess = this.urls.every((url) => url.status === 'success');
            this.status = allSuccess ? 'completed' : 'failed';
        });
    }

    public cancel() {
        this.status = 'cancelled';

        this._queue.forEach((url) => {
            url.status = 'cancelled';
        });

        this._queue = [];
    }

    private _urlsHandler() {
        const url = this._queue.shift();

        if (!url || this.status === 'cancelled') {
            return Promise.resolve();
        }

        return Promise.resolve()
            .then(() => url.check())
            .finally(() => {
                return this._urlsHandler();
            });
    }
}
