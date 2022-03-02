
/** 秒表 */
export class Stopwatch {

    /** 是否使用高分辨率时间 */
    public static isHighRes: boolean = false;

    /** 消耗的时间 */
    private _elapsed: number;

    /** 开始时间戳 */
    private _startTimeStamp: number;

    /** 是否在运行中 */
    private _isRunning: boolean;

    /** 获取是否在运行中 */
    public get isRunning(): boolean {
        return this._isRunning
    }

    /** 获取开始时间戳 */
    public get startTimeStamp(): number {
        return this._startTimeStamp
    }

    /** 获取消耗的时间 */
    public get elapsed(): number {
        return this._elapsed
    }

    /** 构建秒表 */
    constructor() {
        Stopwatch.isHighRes = performance ? true : false
        this.reset()
    }

    /** 开始计时 */
    public start() {
        if (!this._isRunning) {
            this._startTimeStamp = Stopwatch.getTimeStamp()
            this._isRunning = true
        }
    }

    /** 停止计时 */
    public stop() {
        if (this._isRunning) {
            this._elapsed += (Stopwatch.getTimeStamp() - this._startTimeStamp)
            this._isRunning = false
        }
    }

    /** 重置 */
    public reset() {
        this._elapsed = 0
        this._startTimeStamp = 0
        this._isRunning = false
    }

    /** 获取当前时间戳 */
    public static getTimeStamp(): number {
        return Stopwatch.isHighRes ? performance.now() : Date.now()
    }
}