
import { SingleEntityException } from "../../lib/ecs/exceptions/SingleEntityException";
import { Pool } from "../../lib/ecs/Pool";
import { GameBoardCacheComponent } from "../components/GameBoardCacheComponent";
import { GameBoardComponent } from "../components/GameBoardComponent";
import { ScoreComponent } from "../components/ScoreComponent";
import { GameEntity } from "./GameEntity";
import { GameMatcher } from "./GameMatcher";

let pieces = [
    'prefabs/Piece0',
    'prefabs/Piece1',
    'prefabs/Piece2',
    'prefabs/Piece3',
    'prefabs/Piece4',
    'prefabs/Piece5'
];

export class GamePool extends Pool {
    
    /** 创建随机方块 */
    public createRandomPiece(x: number, y: number): GameEntity {
        return this.createEntity(GameEntity, "RandomPiece")
        .setGameBoardElement(true)
        .addPosition(x, y)
        .setMovable(true)
        .setInteractive(true)
        .addResource(pieces[~~(Math.random() * pieces.length)]);
    };
    
    /** 创建拦截器 */
    public createBlocker(x: number, y: number): GameEntity {
        return this.createEntity(GameEntity, "Blocker")
        .setGameBoardElement(true)
        .addPosition(x, y)
        .addResource('prefabs/Blocker');
    };

    /** 棋盘缓存 */
    public get gameBoardCacheEntity(): GameEntity {
        return <GameEntity>this.getGroup(GameMatcher.GameBoardCache).getSingleEntity();
    }
    public get gameBoardCache(): GameBoardCacheComponent {
        return this.gameBoardCacheEntity.gameBoardCache;
    }
    public get hasGameBoardCache(): boolean {
        return this.gameBoardCacheEntity != undefined;
    }
    setGameBoardCache(grid: GameEntity[][]) {
        if (this.hasGameBoardCache) {
            throw new SingleEntityException(GameMatcher.GameBoardCache);
        }
        var entity = this.createEntity(GameEntity, "GameBoardCache");
        entity.addGameBoardCache(grid);
        return entity;
    }
    replaceGameBoardCache(grid: GameEntity[][]) {
        var entity = this.gameBoardCacheEntity;
        if (entity == null) {
            entity = this.setGameBoardCache(grid);
        } else {
            entity.replaceGameBoardCache(grid);
        }
        return entity;
    };
    removeGameBoardCache() {
        this.destroyEntity(this.gameBoardCacheEntity);
    };

    /** 棋盘 */
    public get gameBoardEntity(): GameEntity {
        return <GameEntity>this.getGroup(GameMatcher.GameBoard).getSingleEntity();
    }
    public get gameBoard(): GameBoardComponent {
        return this.gameBoardEntity.gameBoard;
    }
    public get hasGameBoard(): boolean {
        return this.gameBoardEntity != undefined;
    }
    public setGameBoard(columns, rows) {
        if (this.hasGameBoard) {
            throw new SingleEntityException(GameMatcher.GameBoard);
        }
        var entity = this.createEntity(GameEntity, "GameBoard");
        entity.addGameBoard(columns, rows);
        return entity;
    }
    public replaceGameBoard(columns, rows) {
        var entity = this.gameBoardEntity;
        if (entity == null) {
            entity = this.setGameBoard(columns, rows);
        } else {
            entity.replaceGameBoard(columns, rows);
        }
        return entity;
    }
    public removeGameBoard() {
        this.destroyEntity(this.gameBoardEntity);
    }

    /** 计分 */
    public get scoreEntity(): GameEntity {
        return <GameEntity>this.getGroup(GameMatcher.Score).getSingleEntity();
    }
    public get score(): ScoreComponent {
        return this.scoreEntity.score;
    }
    public get hasScore(): boolean {
        return this.scoreEntity != undefined;
    }
    public setScore(value) {
        if (this.hasScore) {
            throw new SingleEntityException(GameMatcher.Score);
        }
        var entity = this.createEntity(GameEntity, "Score");
        entity.addScore(value);
        return entity;
    };
    public replaceScore(value) {
        var entity = this.scoreEntity;
        if (entity == null) {
            entity = this.setScore(value);
        } else {
            entity.replaceScore(value);
        }
        return entity;
    };
    public removeScore() {
        this.destroyEntity(this.scoreEntity);
    };
}