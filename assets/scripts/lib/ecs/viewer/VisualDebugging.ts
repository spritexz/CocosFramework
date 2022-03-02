
import { Entity } from "../Entity"
import { World } from "../World"
import { Group } from "../Group"

/**
 * 视觉调试
 */
export class VisualDebugging {

    private _debugInfo: HTMLElement = null;
    private _world: World = null;

    /** 初始化 */
    public init(world: World) {
        this._world = world;

        //创建debug界面
        this._debugInfo = document.createElement('debugInfo');
        this._debugInfo.style.position = 'absolute'
        this._debugInfo.style.top = '60px';
        this._debugInfo.style.left = '10px';
        this._debugInfo.style.color = '#ffffff';
        document.body.appendChild(this._debugInfo);
    }

    public execute(dt: number) {

        //控制器
        let s = `<font size="1" color="#00E3E3">`;
        s += `Controllers(控制器): count = ${this._world.controllers.length}\n`
        s += '</font>';
        s += `<font size="1" color="#FFAF60">`
        let ctrs = ''
        this._world.controllers.forEach(c=>{
            ctrs += "      " + c.constructor.name + "\n"
        })
        s += `  > [\n${ctrs}    ]\n</font>`;

        //系统
        let systems = this._world.systems;
        s += `<font size="1" color="#00E3E3">`;
        s += `Systems(系统): count = ${systems.initializeSystems.length + systems.executeSystems.length}\n`
        s += '</font>';
        s += `<font size="1" color="#FFAF60">`
        s += `  > initializeSystems</font><font size="1">: ${systems.initializeSystems.length}\n</font>`;
        s += `<font size="1" color="#FFAF60">`
        s += `  > executeSystems</font><font size="1">: ${systems.executeSystems.length}\n</font>`;

        //分组列表
        let pool = this._world.pool;
        s += `<font size="1" color="#00E3E3">`;
        s += `Groups(分组): count = ${pool.groupCount}\n`
        s += '</font>';
        pool.foreachGroups((key: string, group: Group)=>{
            let gs = group.toString()
            s += `<font size="1" color="#FFAF60">`
            s += `  > ${gs}\n</font>`;
            s += `<font size="1" color="#8CEA00">`
            s += `  >> entities: ${group.count}\n</font>`
        })

        //还有引用的实体列表
        s += `<font size="1" color="#00E3E3">`;
        s += `Retained Entitys(还有引用的实体): count = ${pool.retainedEntitiesCount}\n`
        s += '</font>';
        pool.foreachRetainedEntities((key: string, entitie: Entity)=>{
            s += `<font size="1" color="#FFAF60">`
            s += `  > ${entitie.name}</font><font size="1">: ${entitie.id}\n</font>`;
            s += `<font size="1" color="#8CEA00">`
            let cs = entitie.toString()
            if (cs.length > 0) {
                s += `  >> components: [\n       ${entitie.toString()}\n     ]\n</font>`
            } else {
                s += `  >> components: [ ]\n</font>`
            }
        })

        //等待回收的实体列表
        s += `<font size="1" color="#00E3E3">`;
        s += `Reusable Entitys(等待回收的实体): count = ${pool.reusableEntitiesCount}\n`
        s += '</font>';
        pool.foreachReusableEntities((index: number, entitie: Entity)=>{
            s += `<font size="1" color="#FFAF60">`
            s += `  > ${entitie.name}</font><font size="1">: ${entitie.id}\n</font>`;
            s += `<font size="1" color="#8CEA00">`
            let cs = entitie.toString()
            if (cs.length > 0) {
                s += `  >> components: [\n       ${entitie.toString()}\n     ]\n</font>`
            } else {
                s += `  >> components: [ ]\n</font>`
            }
        })
        
        //实体列表
        s += `<font size="1" color="#00E3E3">`;
        s += `Entitys(实体): count = ${pool.count}\n`
        s += '</font>';
        pool.foreachEntities((key: string, entitie: Entity)=>{
            s += `<font size="1" color="#FFAF60">`
            s += `  > ${entitie.name}</font><font size="1">: ${entitie.id}\n</font>`;
            s += `<font size="1" color="#8CEA00">`
            let cs = entitie.toString()
            if (cs.length > 0) {
                s += `  >> components: [\n       ${entitie.toString()}\n     ]\n</font>`
            } else {
                s += `  >> components: [ ]\n</font>`
            }
        })

        //更新显示
        this._debugInfo.innerHTML = `<pre>${s}</pre>`;
    }
}