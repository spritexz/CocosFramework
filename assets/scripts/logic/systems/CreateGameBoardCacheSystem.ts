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

    private _gameBoard: Group = null
    private _gameBoardElements: Group = null

    public setPool(pool: GamePool) {
        this.pool = pool;

        //添加或更新棋盘实体时, 创建新的棋盘元素缓存
        this._gameBoard = pool.getGroup(GameMatcher.GameBoard);
        this._gameBoard.onEntityAdded.add(this.onGameBoardAdded, this);
        this._gameBoard.onEntityUpdated.add(this.onGameBoardUpdated, this);

        //监听棋盘上元素的增加和删除
        this._gameBoardElements = pool.getGroup(GameMatcher.allOf(GameMatcher.GameBoardElement, GameMatcher.Position));
        this._gameBoardElements.onEntityAdded.add(this.onGameBoardElementAdded, this);
        this._gameBoardElements.onEntityRemoved.add(this.onGameBoardElementRemoved, this);
    }

    /** 增加棋盘 */
    private onGameBoardAdded(group, entity, index, component) {
        this.createNewGameBoardCache(<GameBoardComponent>component)
    }

    /** 棋盘数据更新 */
    private onGameBoardUpdated(group, entity, index, previousComponent, newComponent) {
        this.createNewGameBoardCache(<GameBoardComponent>newComponent)
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

    release() {
        this._gameBoard.onEntityAdded.remove(this.onGameBoardAdded, this)
        this._gameBoard.onEntityUpdated.remove(this.onGameBoardUpdated, this)
        this._gameBoardElements.onEntityAdded.remove(this.onGameBoardElementAdded, this)
        this._gameBoardElements.onEntityRemoved.remove(this.onGameBoardElementRemoved, this)
    }
}