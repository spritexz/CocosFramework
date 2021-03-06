
import { director, Vec2, Node, EventTouch, input, Input, EventKeyboard, KeyCode, UITransform, Camera, v2, v3 } from "cc";
import { IController } from "../../lib/ecs/interfaces/IController";
import { GameEntity } from "../extensions/GameEntity";
import { Pools } from "../extensions/Pools";

/** 输入控制器 */
export class InputController implements IController {

    /** 爆破模式 */
    public burstMode: boolean;

    initialize() {
        
        //添加触摸监听
        let canvas = director.getScene().getChildByName('Canvas') as any as Node
        canvas.on(Node.EventType.TOUCH_START, (event:EventTouch)=>{
            this.addInput(event.getLocation())
        })
        canvas.on(Node.EventType.TOUCH_MOVE, (event:EventTouch)=>{
            if (this.burstMode) {
                this.addInput(event.getLocation())
            }
        })
        canvas.on(Node.EventType.TOUCH_END, (event:EventTouch)=>{
        })
        canvas.on(Node.EventType.TOUCH_CANCEL, (event:EventTouch)=>{
        })

        //添加键盘事件
        input.on(Input.EventType.KEY_DOWN, (event: EventKeyboard)=>{
            switch(event.keyCode) {
                case KeyCode.KEY_B:
                    this.burstMode = !this.burstMode;
                    break;
            }
        });
    }

    execute(dt: number) {
    }

    release() {
        let canvas = director.getScene().getChildByName('Canvas') as any as Node
        canvas.off(Node.EventType.TOUCH_START);
        canvas.off(Node.EventType.TOUCH_MOVE);
        canvas.off(Node.EventType.TOUCH_END);
        canvas.off(Node.EventType.TOUCH_CANCEL);
        input.off(Input.EventType.KEY_DOWN);
    }

    /** 添加到输入 */
    addInput(point: Vec2) {
        let canvas = director.getScene().getChildByName('Canvas') as any as Node
        let camera = canvas.getChildByName('Camera').getComponent(Camera)
        let sprite = canvas.getChildByName("Sprite")
        let uiSprite = sprite.getComponent(UITransform)
        let children = sprite.children
        let gameBoard = Pools.pool.gameBoard;
        let pos = camera.screenToWorld(v3(point.x, point.y));
        pos = uiSprite.convertToNodeSpaceAR(pos);
        for (let i = 0, l = children.length; i < l; i++) {
            let ui = children[i].getComponent(UITransform)
            if (ui.getBoundingBox().contains(v2(pos.x, pos.y))) {
                let w = ui.width;
                let x = ~~((pos.x - w + w/2 + gameBoard.rows * w / 2) / w);
                let y = ~~((pos.y - w + w/2 + gameBoard.columns * w / 2) / w);
                let input = Pools.pool.createEntity(GameEntity, 'Input')
                input.addInput(x, y);
                break
            }
        }
    }
}