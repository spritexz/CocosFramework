import { director, Label, Node } from "cc";
import { Group } from "../../lib/ecs/Group";
import { IComponent } from "../../lib/ecs/interfaces/IComponent";
import { IController } from "../../lib/ecs/interfaces/IController";
import { World } from "../../lib/ecs/World";
import { ScoreComponent } from "../components/ScoreComponent";
import { GameEntity } from "../extensions/GameEntity";
import { GameMatcher } from "../extensions/GameMatcher";


/** 分数控制器 */
export class ScoreLabelController implements IController {

    private world: World = null;

    public label: Label = null;

    load(world: World) {
        this.world = world;
    }

    initialize() {
        let canvas = director.getScene().getChildByName('Canvas') as any as Node
        this.label = canvas.getChildByName("Label").getComponent(Label)
        
        var pool = this.world.pool;
        pool.getGroup(GameMatcher.Score).onEntityAdded.add(this.onEntityAdded, this);

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