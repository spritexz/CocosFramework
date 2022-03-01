
/**
 * 实体分析器
 */
export class EntityBehavior {

    private _name: string
    public get name(): string {
        return this._name
    }

    constructor(protected obj) {
        if (this.obj.name) {
            this._name = this.obj.name
        } else {
            this._name = `Entity_${this.obj._creationIndex}`
        }
        Object.defineProperty(this, this._name, { 
            get: () => this.obj.toString() 
        })
    }
}