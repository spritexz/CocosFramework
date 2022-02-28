import { _decorator, Component, Node } from 'cc';
import { Define } from './global/Define';
import { CoreComponentIds } from './logic/components/CoreComponentIds';
import { GameController } from './logic/controllers/GameController';
import { InputController } from './logic/controllers/InputController';
import { ScoreLabelController } from './logic/controllers/ScoreLabelController';
import { GameEntity } from './logic/extensions/GameEntity';
const { ccclass, property } = _decorator;

@ccclass('MainScene')
export class MainScene extends Component {

    public gameController: GameController = null;
    public inputController: InputController = null;
    public scoreController: ScoreLabelController = null;

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

        //创建控制器
        this.gameController = new GameController();
        this.inputController = new InputController();
        this.scoreController = new ScoreLabelController();

        //开始游戏
        this.gameController.start();
        this.inputController.start();
        this.scoreController.start();
    }

    update(dt:number) {
        this.gameController?.update(dt);
        this.inputController?.update(dt);
        this.scoreController?.update(dt);
    }
}
