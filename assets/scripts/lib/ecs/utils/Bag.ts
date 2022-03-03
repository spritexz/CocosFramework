
/**
 * 背包接口
 */
export interface ImmutableBag<E> {
    /** 返回位于背包中指定位置的元素 */
    get(index: number): E;
    /** 返回此背包中的元素数 */
    size(): number;
    /** 如果该列表不包含元素，则返回true */
    isEmpty(): boolean;
    /** 检查背包是否包含此元素 */
    contains(e: E): boolean;
}

/**
 * 背包
 * 集合类型: 有点像数组列表，但不保留实体的顺序，速度方面它非常好，特别适合游戏
 */
export class Bag<E> extends Array implements ImmutableBag<E> {

    /** 背包的大小 */
    public size_: number = 0;

    /** 构建背包:
     * 构造一个带有指定初始容量的空Bag, 
     * 默认初始容量为64的空袋子
    */
    constructor(capacity: number = 64) {
        super();
        this.length = capacity;
    }

    /** 
     * 移除此包中指定位置的元素
     */
    removeAt(index: number): E {
        //复制要删除的元素以便返回
        const e: E = this[index];
        //用最后一个元素覆盖要删除的项
        this[index] = this[--this.size_];
        //最后一个元素赋空，所以gc可以完成它的工作
        this[this.size_] = null;
        return e;
    }

    /**
     * 如果存在指定元素，则从此Bag中删除第一次出现的指定元素 
     * 如果Bag不包含该元素，则该元素不变
     */
    remove(e: E, call: (e1: E, e2: E)=>boolean = null) {
        let e2: E = null;
        const size = this.size_;
        for (let i = 0; i < size; i++) {
            e2 = this[i];
            if (call ? call(e, e2) : e == e2) {
                //用最后一个元素覆盖要删除的项
                this[i] = this[--this.size_];
                //最后一个元素赋空
                this[this.size_] = null;
                return true;
            }
        }
        return false;
    }

    /**
     * 取出并返回包中的最后一个对象
     */
    removeLast(): E {
        if (this.size_ > 0) {
            const e: E = this[--this.size_];
            this[this.size_] = null;
            return e;
        }
        return null;
    }

    /** 
     * 检查背包是否包含此元素
     */
    contains(e: E): boolean {
        let i: number, size: number;
        for (i = 0, size = this.size_; size > i; i++) {
            if (e === this[i]) {
                return true;
            }
        }
        return false
    }

    /**
     * 从当前背包中移除A背包中包含的所有元素
     */
    removeAll(bagA: ImmutableBag<E>): boolean {
        let modified: boolean = false;
        let i: number, j: number, l: number;
        let e1: E, e2: E;
        for (i = 0, l = bagA.size(); i < l; i++) {
            e1 = bagA.get(i);
            for (j = 0; j < this.size_; j++) {
                e2 = this[j];
                if (e1 === e2) {
                    this.removeAt(j);
                    j--;
                    modified = true;
                    break
                }
            }
        }
        return modified;
    }

    /**
     * 返回位于背包中指定位置的元素
     */
    get(index: number): E {
        if (index >= this.length) {
            throw new Error('ArrayIndexOutOfBoundsException');
        }
        return this[index];
    }

    /**
     * 返回位于Bag中指定位置的元素 
     * 此方法确保当请求的索引超出当前后备数组的边界时，包会增长
     */
    safeGet(index: number): E {
        if (index >= this.length) {
            this.grow((index * 7) / 4 + 1);
        }
        return this[index];
    }

    /**
     * 返回此背包中的元素数
     */
    size(): number {
        return this.size_;
    }

    /**
     * 返回背包在不增加的情况下可以容纳的元素数
     */
    getCapacity(): number {
        return this.length;
    }

    /**
     * 检查内部存储是否支持此索引
     */
    isIndexWithInBounds(index: number): boolean {
        return index < this.getCapacity();
    }

    /**
     * 如果该列表不包含元素，则返回true
     */
    isEmpty(): boolean {
        return this.size_ == 0;
    }

    /**
     * 将指定的元素添加到此包的末尾; 
     * 如有需要，也可增加袋的容量
     */
    add(e: E) {
        if (this.size_ === this.length) {
            this.grow();
        }
        this[this.size_++] = e;
    }

    /**
     * 设置包中指定索引处的元素
     */
    set(index: number, e: E) {
        if (index >= this.length) {
            this.grow(index * 2);
        }
        this.size_ = index + 1;
        this[index] = e;
    }

    /** 
     * 扩充背包容量
     */
    grow(newCapacity: number = ~~((this.length * 3) / 2) + 1) {
        this.length = ~~newCapacity
    }

    /** 
     * 确保背包大小足够, 不够使进行扩充
     */
    ensureCapacity(index: number) {
        if (index >= this.length) {
            this.grow(index * 2);
        }
    }

    /**
     * 删除此包中的所有元素, 
     * 调用这个背包将被置空
     */
    clear() {
        let i: number, size: number;
        for (i = 0, size = this.size_; i < size; i++) {
            this[i] = null;
        }
        this.size_ = 0;
    }

    /**
     * 把所有物品都放进这个袋子里
     */
    addAll(items: ImmutableBag<E>) {
        let i: number;
        for (i = 0; items.size() > i; i++) {
            this.add(items.get(i));
        }
    }
}