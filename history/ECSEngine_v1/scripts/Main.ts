
import { _decorator, Component, Node, Button, find, instantiate, Label, Prefab, resources, Toggle, ToggleComponent } from 'cc';
import { Core } from '../libs/ECSEngine/Core';
import { CoreEvents } from '../libs/ECSEngine/ECS/CoreEvents';
import { Graphics } from '../libs/ECSEngine/Graphics/Graphics';
import { PolygonSprite } from './components/PolygonSprite';
import { Batcher } from './graphics/Batcher';
import { Input } from './Input/Input';
import { KeyboardUtils } from './Input/KeyboardUtils';
import { BasicScene } from './scenes/BasicScene';
import { RenderScene, sampleList, SceneEmitType } from './scenes/RenderScene';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {


    start() {
        Core.debugRenderEndabled = true;
        Core.create(true);

        Graphics.instance = new Graphics(new Batcher());
        KeyboardUtils.init();
        Input.initialize();

        Core.scene = new BasicScene();

        this.setupSceneSelector();
    }

    setupSceneSelector() {
        const checkBox = find("Canvas_UI/Layout/DebugRender")?.getComponent(Toggle);
        if (checkBox) {
            checkBox.isChecked = Core.debugRenderEndabled;
            checkBox.node.on('toggle', (toggle: ToggleComponent) => {
                Core.debugRenderEndabled = toggle.isChecked;
            }, this);
        }

        const layout = find("Canvas_UI/Layout");
        sampleList.forEach((value, key) => {
            resources.load('prefabs/Button', Prefab, (err, data) => {
                const buttonNode = instantiate(data);
                layout?.addChild(buttonNode);

                const label = buttonNode.getChildByName("Label")?.getComponent(Label);
                if (label) label.string = key;
                buttonNode.on(Button.EventType.CLICK, () => {
                    Core.scene = new value();
                }, this);
            });
        });

    }

    update(deltaTime: number) {
        Core.emitter.emit(CoreEvents.frameUpdated, deltaTime);

        Input.update();
    }
}
