
import { director, Vec2, Node, EventTouch, input, Input, EventKeyboard, KeyCode, UITransform, Camera, v2, v3 } from "cc";
import { IController } from "../../lib/ecs/interfaces/IController";
import { World } from "../../lib/ecs/World";
import { GameEntity } from "../extensions/GameEntity";

/** 输入控制器 */
export class InputController implements IController {

    private world: World = null;

    /** 爆破模式 */
    public burstMode: boolean = false;

    public point: Vec2 = null;

    load(world: World) {
        this.world = world;
    }

    initialize() {
        
        //添加触摸监听
        let canvas = director.getScene().getChildByName('Canvas') as any as Node
        canvas.on(Node.EventType.TOUCH_START, (event:EventTouch)=>{
            this.point = event.getLocation()
        })
        canvas.on(Node.EventType.TOUCH_MOVE, (event:EventTouch)=>{
            if (this.burstMode) {
                this.point = event.getLocation()
            } else {
                this.point = null
            }
        })
        canvas.on(Node.EventType.TOUCH_END, (event:EventTouch)=>{
            this.point = null
        })
        canvas.on(Node.EventType.TOUCH_CANCEL, (event:EventTouch)=>{
            this.point = null
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
        if (this.point) {
            this.addInput(this.point);
            if (!this.burstMode) {
                this.point = null;
            }
        }
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
        let gameBoard = this.world.pool.gameBoard;
        let pos = camera.screenToWorld(v3(point.x, point.y));
        pos = uiSprite.convertToNodeSpaceAR(pos);
        for (let i = 0, l = children.length; i < l; i++) {
            let ui = children[i].getComponent(UITransform)
            if (ui.getBoundingBox().contains(v2(pos.x, pos.y))) {
                let w = ui.width;
                let x = ~~((pos.x - w + w/2 + gameBoard.rows * w / 2) / w);
                let y = ~~((pos.y - w + w/2 + gameBoard.columns * w / 2) / w);
                let input = this.world.pool.createEntity(GameEntity, 'Input')
                input.addInput(x, y);
                break
            }
        }
    }
}