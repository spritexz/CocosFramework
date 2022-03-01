
/**
 * 异常基类
 */
export class Exception {
    
    /** 异常信息 */
    public message: string

    /** 构建异常 */
    constructor(message) {
        this.message = message
    }

    /** 获取异常信息 */
    public toString(): string {
        return this.message
    }
}