import { _decorator, Component, Node, tween } from 'cc';
import { Define } from './global/Define';

const { ccclass, property } = _decorator;

@ccclass('MainScene')
export class MainScene extends Component {

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
    }

    update(dt:number) {
    }

    onDestroy() {
    }
}
