import { AssetManager, resources, Node } from "cc";
import ResLoading from "../tools/ResLoading";

export class Define {
    
    /** 加载资源
    * @param res_arr 资源列表
    */
    static loadResPakage(node: Node, resArr: string[]): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let packageLen = resArr.length
            if (packageLen == 0) {
                resolve()
                return
            }

            let res_total_count = 0;
            let res_loaded_count = 0;
            let xloading = node.getChildByName('node_loading')?.getComponent(ResLoading);
            let done = (err, assert) => {
                if (!err) {
                    packageLen--
                    if (packageLen == 0) {
                        xloading?.End()
                        resolve()
                    }
                } else {
                    console.error(err);
                    reject(err)
                    xloading?.UpdateInfo(`资源加载出错`, 0, 1, 0);
                }
            }

            let resMap: Map<string, boolean> = new Map<string, boolean>();
            let onprocess = (finish: number, total: number, item: AssetManager.RequestItem) => {
                let uuid = item.uuid;
                if (!resMap.has(uuid)) {
                    // //console.log(uuid);
                } else {
                    if (resMap.get(uuid) == false) {
                        resMap.set(uuid, true);
                        res_loaded_count++;
                    } else {
                        // //console.log(uuid + `已经加载过`);
                    }
                }
                let percent = Math.round(res_loaded_count / res_total_count * 100);
                xloading?.UpdateInfo(`游戏加载中...${percent}%`, res_loaded_count, res_total_count, res_loaded_count / res_total_count);
            }

            for (let i = 0; i < resArr.length; i++) {
                let res = resources.getDirWithPath(resArr[i]);
                for (let j = 0; j < res.length; j++) {
                    resMap.set(res[j].uuid, false);
                }
            }
            res_total_count = resMap.size;
            for (let i = 0; i < resArr.length; i++) {
                resources.loadDir(resArr[i], onprocess, done)
            }
            xloading?.UpdateInfo(`资源加载中(${0}/${res_total_count})`, 0, res_total_count, 0);
            xloading?.Begin()
        })
    }
}