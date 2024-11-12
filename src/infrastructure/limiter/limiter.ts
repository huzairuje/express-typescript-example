export default class RateLimiter {
    private rate: number;
    private interval: number;
    private tokenCount: number;
    private tokens: Array<{}>;
    private refillIntervalId: NodeJS.Timeout | undefined;

    constructor(rate: number, interval: number) {
        this.rate = rate || 1;
        this.interval = interval || 1000;
        this.tokenCount = this.rate;
        this.tokens = Array(this.rate).fill({});
        this.refillTokens();
    }

    private refillTokens() {
        const refillRate = this.interval / this.rate;
        this.refillIntervalId = setInterval(() => {
            for (let i = 0; i < this.rate; i++) {
                if (this.tokens.length < this.rate) {
                    this.tokens.push({});
                } else {
                    break;
                }
            }
        }, refillRate) as NodeJS.Timeout;
    }

    public allow(): boolean {
        if (this.tokens.length > 0) {
            this.tokens.pop();
            return true;
        }
        return false;
    }

    public stop() {
        if (this.refillIntervalId) {
            clearInterval(this.refillIntervalId);
        }
    }
}
