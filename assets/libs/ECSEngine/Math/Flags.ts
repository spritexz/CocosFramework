

import { Ref } from "../Utils/Ref";

/**
 * 帮助处理位掩码的实用程序类
 * 除了isFlagSet之外，所有方法都期望flag参数是一个非移位的标志
 * 允许您使用普通的(0、1、2、3等)来设置/取消您的标记
 */
export class Flags {
    /**
     * 检查位标志是否已在数值中设置
     * 检查期望标志是否已经移位
     * @param self
     * @param flag
     */
    public static isFlagSet(self: number, flag: number): boolean {
        return (self & flag) != 0;
    }

    /**
     * 检查位标志是否在数值中设置
     * @param self
     * @param flag
     */
    public static isUnshiftedFlagSet(self: number, flag: number): boolean {
        flag = 1 << flag;
        return (self & flag) != 0;
    }

    /**
     *  设置数值标志位，移除所有已经设置的标志
     * @param self
     * @param flag
     */
    public static setFlagExclusive(self: Ref<number>, flag: number) {
        self.value = 1 << flag;
    }

    /**
     * 设置标志位
     * @param self
     * @param flag
     */
    public static setFlag(self: Ref<number>, flag: number) {
        self.value = (self.value | 1 << flag);
    }

    /**
     * 取消标志位
     * @param self
     * @param flag
     */
    public static unsetFlag(self: Ref<number>, flag: number) {
        flag = 1 << flag;
        self.value = (self.value & (~flag));
    }

    /**
     * 反转数值集合位
     * @param self
     */
    public static invertFlags(self: Ref<number>) {
        self.value = ~self.value;
    }

    /**
     * 打印 number 的二进制表示。 方便调试 number 标志
     */
    public static binaryStringRepresentation(self: number,
        leftPadWidth: number = 10) {
        let str = self.toString(2);
        while (str.length < (leftPadWidth || 2)) {
            str = '0' + str;
        }
        return str;
    }
}

