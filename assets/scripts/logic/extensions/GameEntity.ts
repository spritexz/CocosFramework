import { Entity } from "../../lib/ecs/Entity";
import { CoreComponentIds } from "../components/CoreComponentIds";
import { PositionComponent } from "../components/PositionComponent";
import { GameBoardElementComponent } from "../components/GameBoardElementComponent";
import { MovableComponent } from "../components/MovableComponent";
import { InteractiveComponent } from "../components/InteractiveComponent";
import { ResourceComponent } from "../components/ResourceComponent";
import { ViewComponent } from "../components/ViewComponent";
import { GameBoardCacheComponent } from "../components/GameBoardCacheComponent";
import { GameBoardComponent } from "../components/GameBoardComponent";
import { DestroyComponent } from "../components/DestroyComponent";
import { InputComponent } from "../components/InputComponent";
import { ScoreComponent } from "../components/ScoreComponent";


export class GameEntity extends Entity {

    /** 位置组件 */
    public static _positionComponentPool = [];
    public get position(): PositionComponent {
        return <PositionComponent>this.getComponent(CoreComponentIds.Position);
    }
    public get hasPosition(): boolean {
        return this.hasComponent(CoreComponentIds.Position);
    }
    public static clearPositionComponentPool() {
        GameEntity._positionComponentPool.length = 0;
    };
    public addPosition(x: number, y: number) {
        var component = GameEntity._positionComponentPool.length > 0 ? GameEntity._positionComponentPool.pop() : new PositionComponent();
        component.x = x;
        component.y = y;
        return <GameEntity>this.addComponent(CoreComponentIds.Position, component);
    };
    public replacePosition(x: number, y: number) {
        var previousComponent = this.hasPosition ? this.position : null;
        var component = GameEntity._positionComponentPool.length > 0 ? GameEntity._positionComponentPool.pop() : new PositionComponent();
        component.x = x;
        component.y = y;
        this.replaceComponent(CoreComponentIds.Position, component);
        if (previousComponent != null) {
            GameEntity._positionComponentPool.push(previousComponent);
        }
        return this;
    };
    public removePosition() {
        var component = this.position;
        this.removeComponent(CoreComponentIds.Position);
        GameEntity._positionComponentPool.push(component);
        return this;
    };

    /** 是否为棋盘元素组件 */
    public static gameBoardElementComponent: GameBoardElementComponent = new GameBoardElementComponent();
    public get isGameBoardElement(): boolean {
        return this.hasComponent(CoreComponentIds.GameBoardElement);
    }
    public set isGameBoardElement(value: boolean) {
        if (value !== this.isGameBoardElement) {
            if (value) {
                this.addComponent(CoreComponentIds.GameBoardElement, GameEntity.gameBoardElementComponent);
            } else {
                this.removeComponent(CoreComponentIds.GameBoardElement);
            }
        }
    }
    public setGameBoardElement(value: boolean) {
        this.isGameBoardElement = value;
        return this;
    };

    /** 是否为可移动的组件 */
    public static movableComponent: MovableComponent = new MovableComponent();
    public get isMovable(): boolean {
        return this.hasComponent(CoreComponentIds.Movable);
    }
    public set isMovable(value: boolean) {
        if (value !== this.isMovable) {
            if (value) {
                this.addComponent(CoreComponentIds.Movable, GameEntity.movableComponent);
            } else {
                this.removeComponent(CoreComponentIds.Movable);
            }
        }
    }
    public setMovable(value: boolean) {
        this.isMovable = value;
        return this;
    };

    /** 是否为可交互的组件 */
    public static interactiveComponent: InteractiveComponent = new InteractiveComponent();
    public get isInteractive(): boolean {
        return this.hasComponent(CoreComponentIds.Interactive);
    }
    public set isInteractive(value: boolean) {
        if (value !== this.isInteractive) {
            if (value) {
                this.addComponent(CoreComponentIds.Interactive, GameEntity.interactiveComponent);
            } else {
                this.removeComponent(CoreComponentIds.Interactive);
            }
        }
    }
    public setInteractive(value: boolean) {
        this.isInteractive = value;
        return this;
    };

    /** 资源文件组件 */
    public static _resourceComponentPool = [];
    public get resource(): ResourceComponent {
        return <ResourceComponent>this.getComponent(CoreComponentIds.Resource);
    }
    public get hasResource(): boolean {
        return this.hasComponent(CoreComponentIds.Resource);
    }
    public static clearResourceComponentPool() {
        GameEntity._resourceComponentPool.length = 0;
    };
    public addResource(name: string) {
        var component = GameEntity._resourceComponentPool.length > 0 ? GameEntity._resourceComponentPool.pop() : new ResourceComponent();
        component.name = name;
        return <GameEntity>this.addComponent(CoreComponentIds.Resource, component);
    };
    public replaceResource(name: string) {
        var previousComponent = this.hasResource ? this.resource : null;
        var component = GameEntity._resourceComponentPool.length > 0 ? GameEntity._resourceComponentPool.pop() : new ResourceComponent();
        component.name = name;
        this.replaceComponent(CoreComponentIds.Resource, component);
        if (previousComponent != null) {
            GameEntity._resourceComponentPool.push(previousComponent);
        }
        return this;
    };
    public removeResource() {
        var component = this.resource;
        this.removeComponent(CoreComponentIds.Resource);
        GameEntity._resourceComponentPool.push(component);
        return this;
    };

    /** 界面组件 */
    public static _viewComponentPool = [];
    public get view(): ViewComponent {
        return <ViewComponent>this.getComponent(CoreComponentIds.View);
    }
    public get hasView(): boolean {
        return this.hasComponent(CoreComponentIds.View);
    }
    public static clearViewComponentPool() {
        GameEntity._viewComponentPool.length = 0;
    };
    public addView(sprite: any) {
        var component = GameEntity._viewComponentPool.length > 0 ? GameEntity._viewComponentPool.pop() : new ViewComponent();
        component.sprite = sprite;
        return <GameEntity>this.addComponent(CoreComponentIds.View, component);
    };
    public replaceView(sprite: any) {
        var previousComponent = this.hasView ? this.view : null;
        var component = GameEntity._viewComponentPool.length > 0 ? GameEntity._viewComponentPool.pop() : new ViewComponent();
        component.sprite = sprite;
        this.replaceComponent(CoreComponentIds.View, component);
        if (previousComponent != null) {
            GameEntity._viewComponentPool.push(previousComponent);
        }
        return this;
    };
    public removeView() {
        var component = this.view;
        this.removeComponent(CoreComponentIds.View);
        GameEntity._viewComponentPool.push(component);
        return this;
    };

    /** 游戏棋盘缓存 */
    public static _gameBoardCacheComponentPool = [];
    public get gameBoardCache(): GameBoardCacheComponent {
        return <GameBoardCacheComponent>this.getComponent(CoreComponentIds.GameBoardCache);
    }
    public get hasGameBoardCache(): boolean {
        return this.hasComponent(CoreComponentIds.GameBoardCache);
    }
    public static clearGameBoardCacheComponentPool() {
        GameEntity._gameBoardCacheComponentPool.length = 0;
    };
    public addGameBoardCache(grid: Array<Array<GameEntity>>) {
        var component = GameEntity._gameBoardCacheComponentPool.length > 0 ? GameEntity._gameBoardCacheComponentPool.pop() : new GameBoardCacheComponent();
        component.grid = grid;
        return <GameEntity>this.addComponent(CoreComponentIds.GameBoardCache, component);
    };
    public replaceGameBoardCache(grid: Array<Array<GameEntity>>) {
        var previousComponent = this.hasGameBoardCache ? this.gameBoardCache : null;
        var component = GameEntity._gameBoardCacheComponentPool.length > 0 ? GameEntity._gameBoardCacheComponentPool.pop() : new GameBoardCacheComponent();
        component.grid = grid;
        this.replaceComponent(CoreComponentIds.GameBoardCache, component);
        if (previousComponent != null) {
            GameEntity._gameBoardCacheComponentPool.push(previousComponent);
        }
        return this;
    };
    public removeGameBoardCache() {
        var component = this.gameBoardCache;
        this.removeComponent(CoreComponentIds.GameBoardCache);
        GameEntity._gameBoardCacheComponentPool.push(component);
        return this;
    };

    /** 游戏棋盘 */
    public static _gameBoardComponentPool = [];
    public get gameBoard(): GameBoardComponent {
        return <GameBoardComponent>this.getComponent(CoreComponentIds.GameBoard);
    }
    public get hasGameBoard(): boolean {
        return this.hasComponent(CoreComponentIds.GameBoard);
    }
    public static clearGameBoardComponentPool() {
        GameEntity._gameBoardComponentPool.length = 0;
    };
    public addGameBoard(columns: number, rows: number) {
        var component = GameEntity._gameBoardComponentPool.length > 0 ? GameEntity._gameBoardComponentPool.pop() : new GameBoardComponent();
        component.columns = columns;
        component.rows = rows;
        return <GameEntity>this.addComponent(CoreComponentIds.GameBoard, component);
    };
    public replaceGameBoard(columns: number, rows: number) {
        var previousComponent = this.hasGameBoard ? this.gameBoard : null;
        var component = GameEntity._gameBoardComponentPool.length > 0 ? GameEntity._gameBoardComponentPool.pop() : new GameBoardComponent();
        component.columns = columns;
        component.rows = rows;
        this.replaceComponent(CoreComponentIds.GameBoard, component);
        if (previousComponent != null) {
            GameEntity._gameBoardComponentPool.push(previousComponent);
        }
        return this;
    };
    public removeGameBoard() {
        var component = this.gameBoard;
        this.removeComponent(CoreComponentIds.GameBoard);
        GameEntity._gameBoardComponentPool.push(component);
        return this;
    };

    /** 是否为已销毁的组件 */
    public static destroyComponent: DestroyComponent = new DestroyComponent();
    public get isDestroy(): boolean {
        return this.hasComponent(CoreComponentIds.Destroy);
    }
    public set isDestroy(value: boolean) {
        if (value !== this.isDestroy) {
            if (value) {
                this.addComponent(CoreComponentIds.Destroy, GameEntity.destroyComponent);
            } else {
                this.removeComponent(CoreComponentIds.Destroy);
            }
        }
    }
    public setDestroy(value: boolean) {
        this.isDestroy = value;
        return this;
    };

    /** 输入位置组件 */
    public static _inputComponentPool = [];
    public get input(): InputComponent {
        return <InputComponent>this.getComponent(CoreComponentIds.Input);
    }
    public get hasInput(): boolean {
        return this.hasComponent(CoreComponentIds.Input);
    }
    public static clearInputComponentPool() {
        GameEntity._inputComponentPool.length = 0;
    };
    public addInput(x: number, y: number) {
        var component = GameEntity._inputComponentPool.length > 0 ? GameEntity._inputComponentPool.pop() : new InputComponent();
        component.x = x;
        component.y = y;
        return <GameEntity>this.addComponent(CoreComponentIds.Input, component);
    };
    public replaceInput(x: number, y: number) {
        var previousComponent = this.hasInput ? this.input : null;
        var component = GameEntity._inputComponentPool.length > 0 ? GameEntity._inputComponentPool.pop() : new InputComponent();
        component.x = x;
        component.y = y;
        this.replaceComponent(CoreComponentIds.Input, component);
        if (previousComponent != null) {
            GameEntity._inputComponentPool.push(previousComponent);
        }
        return this;
    };
    public removeInput() {
        var component = this.input;
        this.removeComponent(CoreComponentIds.Input);
        GameEntity._inputComponentPool.push(component);
        return this;
    };

    /** 计分组件 */
    public static _scoreComponentPool = [];
    public get score(): ScoreComponent {
        return <ScoreComponent>this.getComponent(CoreComponentIds.Score);
    }
    public get hasScore(): boolean {
        return this.hasComponent(CoreComponentIds.Score);
    }
    public static clearScoreComponentPool() {
        GameEntity._scoreComponentPool.length = 0;
    };
    public addScore(value: number) {
        var component = GameEntity._scoreComponentPool.length > 0 ? GameEntity._scoreComponentPool.pop() : new ScoreComponent();
        component.value = value;
        return <GameEntity>this.addComponent(CoreComponentIds.Score, component);
    };
    public replaceScore(value: number) {
        var previousComponent = this.hasScore ? this.score : null;
        var component = GameEntity._scoreComponentPool.length > 0 ? GameEntity._scoreComponentPool.pop() : new ScoreComponent();
        component.value = value;
        this.replaceComponent(CoreComponentIds.Score, component);
        if (previousComponent != null) {
            GameEntity._scoreComponentPool.push(previousComponent);
        }
        return this;
    };
    public removeScore() {
        var component = this.score;
        this.removeComponent(CoreComponentIds.Score);
        GameEntity._scoreComponentPool.push(component);
        return this;
    };
    
}