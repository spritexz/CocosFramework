import { director, Label, Node } from "cc";
import { Group } from "../../lib/ecs/Group";
import { IComponent } from "../../lib/ecs/interfaces/IComponent";
import { IController } from "../../lib/ecs/interfaces/IController";
import { ScoreComponent } from "../components/ScoreComponent";
import { GameEntity } from "../extensions/GameEntity";
import { GameMatcher } from "../extensions/GameMatcher";
import { Pools } from "../extensions/Pools";


/** 分数控制器 */
export class ScoreLabelController implements IController {

    public label: Label = null;

    initialize() {
        let canvas = director.getScene().getChildByName('Canvas') as any as Node
        this.label = canvas.getChildByName("Label").getComponent(Label)
        
        var pool = Pools.pool;
        pool.getGroup(GameMatcher.Score).onEntityAdded.add(this.onEntityAdded.bind(this));

        this.updateScore(pool.score.value);
    }

    execute(dt: number) {
    }

    release() {
    }

    updateScore(score: number) {
        this.label.string = 'Score: ' + score;
    }

    onEntityAdded(group: Group, entity: GameEntity, index: number, component: IComponent) {
        this.updateScore(entity.score.value);
    }
}