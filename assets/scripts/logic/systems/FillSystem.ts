import { IReactiveSystem } from "../../lib/ecs/interfaces/IReactiveSystem";
import { ISetPool } from "../../lib/ecs/interfaces/ISystem";
import { TriggerOnEvent } from "../../lib/ecs/TriggerOnEvent";
import { World } from "../../lib/ecs/World";
import { GameBoardCacheComponent } from "../components/GameBoardCacheComponent";
import { GameBoardComponent } from "../components/GameBoardComponent";
import { GameEntity } from "../extensions/GameEntity";
import { GameMatcher } from "../extensions/GameMatcher";
import { GamePool } from "../extensions/GamePool";

/** 获取下一个空的行 */
function getNextEmptyRow(grid, column: number, row: number) {
    var rowBelow = row - 1;
    while (rowBelow >= 0 && grid[column][rowBelow] === undefined) {
        rowBelow -= 1;
    }
    return rowBelow + 1;
}

/** 填充系统 */
export class FillSystem implements IReactiveSystem, ISetPool {

    protected pool: GamePool;
    
    public get trigger(): TriggerOnEvent {
        return GameMatcher.GameBoardElement.onEntityRemoved();
    }

    initialize(world: World) {
    }

    public setPool(pool: GamePool) {
        this.pool = pool;
    }

    public execute(entities: Array<GameEntity>) {
        var gameBoard: GameBoardComponent = <GameBoardComponent>(this.pool.gameBoard);
        var grid = (<GameBoardCacheComponent>this.pool.gameBoardCache).grid;

        for (var column = 0; column < gameBoard.columns; column++) {
            var nextRowPos = getNextEmptyRow(grid, column, gameBoard.rows);
            while (nextRowPos != gameBoard.rows) {
                this.pool.createRandomPiece(column, nextRowPos);
                nextRowPos = getNextEmptyRow(grid, column, gameBoard.rows);
            }
        }
    }
}