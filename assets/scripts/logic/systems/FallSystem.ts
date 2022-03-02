
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
function getNextEmptyRow(grid: GameEntity[][], column: number, row: number) {
    var rowBelow = row - 1;
    while (rowBelow >= 0 && grid[column][rowBelow] === undefined) {
        rowBelow -= 1;
    }
    return rowBelow + 1;
}

/** 降落系统 */
export class FallSystem implements IReactiveSystem, ISetPool {

    protected pool: GamePool;
    public get trigger(): TriggerOnEvent {
        return GameMatcher.GameBoardElement.onEntityRemoved();
    }

    initialize(world: World) {
    }

    public setPool(pool: GamePool) {
        this.pool = pool;
    }

    public execute(entities: GameEntity[]) {
        var gameBoard = this.pool.gameBoard;
        var grid = this.pool.gameBoardCache.grid;
        for (var column = 0; column < gameBoard.columns; column++) {
            for (var row = 1; row < gameBoard.rows; row++) {
                var e = grid[column][row];
                if (e !== undefined && e.isMovable) {
                    this.moveDown(e, column, row, grid);
                }
            }
        }
    }

    /** 下移 */
    protected moveDown(e: GameEntity, column: number, row: number, grid: any) {
        var nextRowPos = getNextEmptyRow(grid, column, row);
        if (nextRowPos !== row) {
            e.replacePosition(column, nextRowPos);
        }
    }
}