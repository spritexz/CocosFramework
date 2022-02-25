import { _decorator, Component, Node } from 'cc';
import { Define } from './global/Define';
import { CoreComponentIds } from './logic/components/CoreComponentIds';
import { GameController } from './logic/controllers/GameController';
import { GameEntity } from './logic/extensions/GameEntity';
const { ccclass, property } = _decorator;

@ccclass('MainScene')
export class MainScene extends Component {

    public game: GameController = null;

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

        //初始化
        GameEntity.initialize(CoreComponentIds.TotalComponents, { "entities": 200, "components": 128 });

        //启动游戏
        this.game = new GameController();
        this.game.start();
    }

    update(dt:number) {
        this.game?.update(dt);
    }
}
