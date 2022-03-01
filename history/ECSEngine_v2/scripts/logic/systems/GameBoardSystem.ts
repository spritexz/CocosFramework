import { Exception } from "../../lib/ecs/exceptions/Exception";
import { Group } from "../../lib/ecs/Group";
import { IInitializeSystem } from "../../lib/ecs/interfaces/IInitializeSystem";
import { IReactiveSystem } from "../../lib/ecs/interfaces/IReactiveSystem";
import { ISetPool } from "../../lib/ecs/interfaces/ISystem";
import { TriggerOnEvent } from "../../lib/ecs/TriggerOnEvent";
import { GameEntity } from "../extensions/GameEntity";
import { GameMatcher } from "../extensions/GameMatcher";
import { GamePool } from "../extensions/GamePool";

/** 游戏棋盘系统 */
export class GameBoardSystem implements IInitializeSystem, IReactiveSystem, ISetPool {

    protected pool: GamePool;

    protected gameBoardElements: Group;

    public get trigger(): TriggerOnEvent {
        return GameMatcher.GameBoard.onEntityAdded();
    }

    public setPool(pool: GamePool) {
        this.pool = pool;
        this.gameBoardElements = pool.getGroup(GameMatcher.allOf(GameMatcher.GameBoardElement, GameMatcher.Position));
    }

    public initialize() {
        var gameBoard = (<GameEntity>this.pool.setGameBoard(8, 9)).gameBoard;
        for (var row = 0; row < gameBoard.rows; row++) {
            for (var column = 0; column < gameBoard.columns; column++) {
                if (Math.random() > 0.91) {
                    this.pool.createBlocker(column, row);
                } else {
                    this.pool.createRandomPiece(column, row);
                }
            }
        }
    }

    public execute(entities: Array<GameEntity>) {
        if (entities.length != 1) {
            throw new Exception("预期只有一个实体, 但是查找到多个: " + entities.length);
        }
        var gameBoard = entities[0].gameBoard;
        for (let e of <GameEntity[]>this.gameBoardElements.getEntities()) {
            if (e.position.x >= gameBoard.columns || e.position.y >= gameBoard.rows) {
                e.isDestroy = true;
            }
        }
    }
}