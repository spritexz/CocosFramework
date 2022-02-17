import { MathHelper } from "../../Math/MathHelper";
import { Matrix2D } from "../../Math/Matrix2D";
import { Vector2 } from "../../Math/Vector2";


export class Vector2Ext {
    /**
     * 检查三角形是CCW还是CW
     * @param a
     * @param center
     * @param c
     */
    public static isTriangleCCW(a: Vector2, center: Vector2, c: Vector2) {
        return this.cross(center.sub(a), c.sub(center)) < 0;
    }

    public static halfVector(): Vector2 {
        return new Vector2(0.5, 0.5);
    }

    /**
     * 计算二维伪叉乘点(Perp(u)， v)
     * @param u
     * @param v
     */
    public static cross(u: Vector2, v: Vector2) {
        return u.y * v.x - u.x * v.y;
    }

    /**
     * 返回垂直于传入向量的向量
     * @param first
     * @param second
     */
    public static perpendicular(first: Vector2, second: Vector2) {
        return new Vector2(-1 * (second.y - first.y), second.x - first.x);
    }

    /**
     * 将x/y值翻转，并将y反转，得到垂直于x/y的值
     * @param original 
     */
    public static perpendicularFlip(original: Vector2) {
        return new Vector2(-original.y, original.x);
    }

    /**
     * 返回两个向量之间的角度，单位为度
     * @param from 
     * @param to 
     */
    public static angle(from: Vector2, to: Vector2) {
        this.normalize(from);
        this.normalize(to);
        return Math.acos(MathHelper.clamp(from.dot(to), -1, 1)) * MathHelper.Rad2Deg;
    }

    /**
     * 返回以自度为中心的左右角度 
     * @param self 
     * @param left 
     * @param right 
     */
    public static angleBetween(self: Vector2, left: Vector2, right: Vector2) {
        const one = left.sub(self);
        const two = right.sub(self);
        return this.angle(one, two);
    }

    /**
     * 给定两条直线(ab和cd)，求交点
     * @param a 
     * @param b 
     * @param c 
     * @param d 
     * @param intersection 
     */
    public static getRayIntersection(a: Vector2, b: Vector2, c: Vector2, d: Vector2, intersection: Vector2 = Vector2.zero) {
        let dy1 = b.y - a.y;
        let dx1 = b.x - a.x;
        let dy2 = d.y - c.y;
        let dx2 = d.x - c.x;

        if (dy1 * dx2 == dy2 * dx1) {
            intersection.x = Number.NaN;
            intersection.y = Number.NaN;
            return false;
        }

        let x = ((c.y - a.y) * dx1 * dx2 + dy1 * dx2 * a.x - dy2 * dx1 * c.x) / (dy1 * dx2 - dy2 * dx1);
        let y = a.y + (dy1 / dx1) * (x - a.x);

        intersection.x = x;
        intersection.y = y;
        return true;
    }

    /**
     * Vector2的临时解决方案
     * 标准化把向量弄乱了
     * @param vec
     */
    public static normalize(vec: Vector2) {
        let magnitude = Math.sqrt((vec.x * vec.x) + (vec.y * vec.y));
        if (magnitude > MathHelper.Epsilon) {
            vec.divideScaler(magnitude);
        } else {
            vec.x = vec.y = 0;
        }
    }

    /**
     * 通过指定的矩阵对Vector2的数组中的向量应用变换，并将结果放置在另一个数组中。
     * @param sourceArray
     * @param sourceIndex
     * @param matrix
     * @param destinationArray
     * @param destinationIndex
     * @param length
     */
    public static transformA(sourceArray: Vector2[], sourceIndex: number, matrix: Matrix2D,
        destinationArray: Vector2[], destinationIndex: number, length: number) {
        for (let i = 0; i < length; i++) {
            let position = sourceArray[sourceIndex + i];
            let destination = destinationArray[destinationIndex + i];
            destination.x = (position.x * matrix.m11) + (position.y * matrix.m21) + matrix.m31;
            destination.y = (position.x * matrix.m12) + (position.y * matrix.m22) + matrix.m32;
            destinationArray[destinationIndex + i] = destination;
        }
    }

    /**
     * 创建一个新的Vector2，该Vector2包含了通过指定的Matrix进行的二维向量变换
     * @param position 
     * @param matrix 
     * @param result 
     */
    public static transformR(position: Vector2, matrix: Matrix2D, result: Vector2 = Vector2.zero) {
        let x = (position.x * matrix.m11) + (position.y * matrix.m21) + matrix.m31;
        let y = (position.x * matrix.m12) + (position.y * matrix.m22) + matrix.m32;
        result.x = x;
        result.y = y;
    }

    /**
     * 通过指定的矩阵对Vector2的数组中的所有向量应用变换，并将结果放到另一个数组中。
     * @param sourceArray
     * @param matrix
     * @param destinationArray
     */
    public static transform(sourceArray: Vector2[], matrix: Matrix2D, destinationArray: Vector2[]) {
        this.transformA(sourceArray, 0, matrix, destinationArray, 0, sourceArray.length);
    }

    public static round(vec: Vector2) {
        return new Vector2(Math.round(vec.x), Math.round(vec.y));
    }
}

