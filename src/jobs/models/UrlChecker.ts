export class URLChecker {
  public readonly url: string;
  public status: 'pending' | 'in_progress' | 'success' | 'error' | 'cancelled';
  public httpCode?: number | null;
  public errorMessage?: string | null;
  public startTime?: Date;
  public endTime?: Date;
  public duration?: number;

  constructor(url: string) {
    this.url = url;
    this.status = 'pending';
  }

  public check() {
    this.startTime = new Date();
    this.status = 'in_progress';

    return Promise.resolve()
      .then(() => this._getHeadRequestData())
      .then((data) => this._randomDelay().then(() => data))
      .then((response) => {
        this.status = response.status as 'success' | 'error';
        this.httpCode = response.httpCode;
        this.errorMessage = response.errorMessage;
        this.endTime = new Date();
        this.duration = this.endTime.getTime() - this.startTime!.getTime();
      });
  }

  private _getHeadRequestData() {
    return Promise.resolve()
      .then(() => fetch(this.url, { method: 'HEAD' }))
      .then((response) => {
        return {
          url: this.url,
          status: response.ok ? 'success' : 'error',
          httpCode: response.status,
          errorMessage: response.ok ? null : response.statusText,
        };
      })
      .catch((error) => {
        return {
          url: this.url,
          status: 'error',
          httpCode: null,
          errorMessage: error.message,
        };
      });
  }

  private _randomDelay() {
    const delay = Math.floor(Math.random() * 10000);

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, delay);
    });
  }
}
