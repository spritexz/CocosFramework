import { IInitializeSystem } from "../../lib/ecs/interfaces/IInitializeSystem";
import { IReactiveSystem } from "../../lib/ecs/interfaces/IReactiveSystem";
import { ISetPool } from "../../lib/ecs/interfaces/ISystem";
import { TriggerOnEvent } from "../../lib/ecs/TriggerOnEvent";
import { ScoreComponent } from "../components/ScoreComponent";
import { GameEntity } from "../extensions/GameEntity";
import { GameMatcher } from "../extensions/GameMatcher";
import { GamePool } from "../extensions/GamePool";

/** 计分系统 */
export class ScoreSystem implements IInitializeSystem, IReactiveSystem, ISetPool {
    protected pool:GamePool;
    public get trigger():TriggerOnEvent {
      return GameMatcher.GameBoardElement.onEntityRemoved();
    }
    
    public setPool(pool:GamePool) {
      this.pool = pool;
    }

    public initialize() {
      this.pool.setScore(0);
    }
    
    public execute(entities:Array<GameEntity>) {
      var score:ScoreComponent = <ScoreComponent>(this.pool.score);
      this.pool.replaceScore(score.value + entities.length);
    }
  }