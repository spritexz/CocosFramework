import { _decorator, Component, Node, tween } from 'cc';
import { Define } from './global/Define';
import { World } from './lib/ecs/World';
import { CoreComponentIds } from './logic/components/CoreComponentIds';
import { GameController } from './logic/controllers/GameController';
import { InputController } from './logic/controllers/InputController';
import { ScoreLabelController } from './logic/controllers/ScoreLabelController';
import { GameEntity } from './logic/extensions/GameEntity';
import { Pools } from './logic/extensions/Pools';
const { ccclass, property } = _decorator;

@ccclass('MainScene')
export class MainScene extends Component {

    public gameWorld: World = null;

    start () {

        //加载资源
        let resArr = [
            'prefabs',
        ]
        Define.loadResPakage(this.node, resArr).then(() => {
            this.init()
        }).catch(err => {
            console.error("资源加载错误：" + err);
        })
    }

    init(b=false) {

        //初始化
        GameEntity.initialize(CoreComponentIds.TotalComponents, { "entities": 200, "components": 128 });

        //创建并初始化游戏世界
        let controllers = [
            GameController,
            InputController,
            ScoreLabelController,
        ]
        this.gameWorld = new World();
        this.gameWorld.initialize(controllers);
        
        if (!b) {
            tween(this).delay(10).call(()=>{
                console.log("移除游戏世界重新加载");
                this.gameWorld?.release();
                this.gameWorld = null;
                Pools.destroyPool()
                this.init(true)
            }).start()
        }
    }

    update(dt:number) {
        this.gameWorld?.execute(dt);
    }

    onDestroy() {
        this.gameWorld?.release();
        this.gameWorld = null;
    }
}
