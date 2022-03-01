import { _decorator, Component, Label, Node, Animation, ProgressBar, Widget } from 'cc';
const {ccclass, property, menu} = _decorator;

@ccclass('ResLoading')
@menu("工具/ResLoading")
export default class ResLoading extends Component {
    
    @property(Animation)
    nodeAni : Animation | null = null;
    
    @property(Node)
    spIcon : Node | null = null;
    
    @property(Label)
    lable : Label | null = null;

    @property(ProgressBar)
    processBar : ProgressBar | null = null;

    start() {
        //this.nodeAni.defaultClip.speed = 3.6
    }

    UpdateInfo(text , cur , max , percent : number){
        this.processBar.progress = percent;
        this.lable.string = text;
        this.spIcon.getComponent(Widget).updateAlignment()
    }

    Begin(){
        this.node.active = true;
    }

    End(){
        this.node.active = false;
    }

    update (dt) {

    }
}