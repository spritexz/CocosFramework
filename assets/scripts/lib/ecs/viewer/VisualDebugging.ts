import { Entity } from "../Entity"
import { Pool } from "../Pool"
import { Systems } from "../Systems"
import { World } from "../World"
import { SystemObserver } from "./SystemObserver"

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
        s += `Controllers: count = ${this._world.controllers.length}\n`
        s += '</font>';

        //系统
        let systems = this._world.systems;
        s += `<font size="1" color="#00E3E3">`;
        s += `Systems: count = ${systems.initializeSystems.length + systems.executeSystems.length}\n`
        s += '</font>';
        s += `<font size="1" color="#FFAF60">`
        s += `  > initializeSystems</font><font size="1">: ${systems.initializeSystems.length}\n</font>`;
        s += `<font size="1" color="#FFAF60">`
        s += `  > executeSystems</font><font size="1">: ${systems.executeSystems.length}\n</font>`;
        
        //实体列表
        s += `<font size="1" color="#00E3E3">`;
        s += `Entitys: count = ${this._world.pool.count}\n`
        s += '</font>';
        this._world.pool.foreachEntities((key: string, entitie: Entity)=>{
            s += `<font size="1" color="#FFAF60">`
            s += `  > ${entitie.name}</font><font size="1">: ${entitie.id}\n</font>`;
            s += `<font size="1" color="#8CEA00">`
            s += `  >> components: [\n       ${entitie.toString()}\n     ]\n</font>`
        })

        //更新显示
        this._debugInfo.innerHTML = `<pre>${s}</pre>`;
    }
}