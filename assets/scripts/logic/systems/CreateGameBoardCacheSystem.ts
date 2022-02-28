import { Group } from "../../lib/ecs/Group";
import { IComponent } from "../../lib/ecs/interfaces/IComponent";
import { ISetPool, ISystem } from "../../lib/ecs/interfaces/ISystem";
import { GameBoardCacheComponent } from "../components/GameBoardCacheComponent";
import { GameBoardComponent } from "../components/GameBoardComponent";
import { GameEntity } from "../extensions/GameEntity";
import { GameMatcher } from "../extensions/GameMatcher";
import { GamePool } from "../extensions/GamePool";

/** 游戏元素缓存创建系统 */
export class CreateGameBoardCacheSystem implements ISystem, ISetPool {
    protected pool: GamePool;

    public setPool(pool: GamePool) {
        this.pool = pool;

        //添加或更新棋盘实体时, 创建新的棋盘元素缓存
        var gameBoard = pool.getGroup(GameMatcher.GameBoard);
        gameBoard.onEntityAdded.add((group, entity, index, component) =>
            this.createNewGameBoardCache(<GameBoardComponent>component)
        );
        gameBoard.onEntityUpdated.add((group, entity, index, previousComponent, newComponent) =>
            this.createNewGameBoardCache(<GameBoardComponent>newComponent)
        );

        //监听棋盘上元素的增加和删除
        var gameBoardElements = pool.getGroup(GameMatcher.allOf(GameMatcher.GameBoardElement, GameMatcher.Position));
        gameBoardElements.onEntityAdded.add(this.onGameBoardElementAdded);
        gameBoardElements.onEntityRemoved.add(this.onGameBoardElementRemoved);
    }

    /** 创建新的游戏棋盘缓存 */
    protected createNewGameBoardCache(gameBoard: GameBoardComponent) {

        //创建棋盘元素数据
        var grid: any = new Array(gameBoard.rows);
        for (var r = 0; r < gameBoard.rows; r++) {
            grid[r] = new Array(gameBoard.columns);
        }

        //更新棋盘缓存
        var entities = this.pool.getEntities(GameMatcher.allOf(GameMatcher.GameBoardElement, GameMatcher.Position));
        for (var e of entities) {
            var pos = (<GameEntity>e).position;
            grid[pos.x][pos.y] = e;
        }
        this.pool.replaceGameBoardCache(grid);
    }

    /** 添加游戏棋盘元素 */
    protected onGameBoardElementAdded = (group: Group, entity: GameEntity, index: number, component: IComponent) => {
        var grid: any = (<GameBoardCacheComponent>this.pool.gameBoardCache).grid;
        var pos = entity.position;
        grid[pos.x][pos.y] = entity;
        this.pool.replaceGameBoardCache(grid);

    };

    /** 移除游戏棋盘元素 */
    protected onGameBoardElementRemoved = (group: Group, entity: GameEntity, index: number, component: IComponent) => {
        if ('x' in component && 'y' in component) {
            var pos: any = component;
        } else {
            var pos: any = entity.position;
        }
        var grid: any = (<GameBoardCacheComponent>this.pool.gameBoardCache).grid;
        delete grid[pos.x][pos.y];
        this.pool.replaceGameBoardCache(grid);
    };
}