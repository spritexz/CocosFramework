import { _decorator, Component, Node, tween } from 'cc';
import { Define } from './global/Define';
import { World } from './lib/ecs/World';
import { CoreComponentIds } from './logic/components/CoreComponentIds';
import { GameController } from './logic/controllers/GameController';
import { InputController } from './logic/controllers/InputController';
import { ScoreLabelController } from './logic/controllers/ScoreLabelController';
import { GameEntity } from './logic/extensions/GameEntity';
import { GamePool } from './logic/extensions/GamePool';
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

    init() {

        //创建并初始化游戏世界
        this.gameWorld = new World();
        this.gameWorld.load(GamePool, CoreComponentIds, CoreComponentIds.TotalComponents, true, 200)
        this.gameWorld.initialize([
            GameController,
            InputController,
            ScoreLabelController,
        ]);


        tween(this.node).delay(5).call(()=>{
            this.gameWorld.release()
            this.init()
        }).start()
    }

    update(dt:number) {
        this.gameWorld?.execute(dt);
    }

    onDestroy() {
        this.gameWorld?.release();
        this.gameWorld = null;
    }
}
