import { Entity } from "../../lib/ecs/Entity";
import { CoreComponentIds } from "../components/CoreComponentIds";
import { PlayerComponent } from "../components/PlayerComponent";
import { PositionComponent } from "../components/PositionComponent";
import { ResourceComponent } from "../components/ResourceComponent";
import { SpriteComponent } from "../components/SpriteComponent";
import { VelocityComponent } from "../components/VelocityComponent";


export class GameEntity extends Entity {

    /** velocity component */
    static _velocityComponentPool = [];
    public get velocity(): VelocityComponent {
        return <VelocityComponent>this.getComponent(CoreComponentIds.Velocity);
    }
    public get hasVelocity(): boolean {
        return this.hasComponent(CoreComponentIds.Velocity);
    }
    static clearVelocityComponentPool = function () {
        GameEntity._velocityComponentPool.length = 0;
    };
    public addVelocity(x:number, y:number) {
        var component = GameEntity._velocityComponentPool.length > 0 ? GameEntity._velocityComponentPool.pop() : new VelocityComponent();
        component.x = x;
        component.y = y;
        return <GameEntity>this.addComponent(CoreComponentIds.Velocity, component);
    };
    public replaceVelocity(x:number, y:number) {
        var previousComponent = this.hasVelocity ? this.velocity : null;
        var component = GameEntity._velocityComponentPool.length > 0 ? GameEntity._velocityComponentPool.pop() : new VelocityComponent();
        component.x = x;
        component.y = y;
        this.replaceComponent(CoreComponentIds.Velocity, component);
        if (previousComponent != null) {
            GameEntity._velocityComponentPool.push(previousComponent);
        }
        return this;
    };
    public removeVelocity() {
        var component = this.velocity;
        this.removeComponent(CoreComponentIds.Velocity);
        GameEntity._velocityComponentPool.push(component);
        return this;
    };

    /** position component */
    static _positionComponentPool = [];
    public get position(): PositionComponent {
        return <PositionComponent>this.getComponent(CoreComponentIds.Position);
    }
    public get hasPosition(): boolean {
        return this.hasComponent(CoreComponentIds.Position);
    }
    static clearPositionComponentPool = function () {
        GameEntity._positionComponentPool.length = 0;
    };
    public addPosition(x:number, y:number) {
        var component = GameEntity._positionComponentPool.length > 0 ? GameEntity._positionComponentPool.pop() : new PositionComponent();
        component.x = x;
        component.y = y;
        return <GameEntity>this.addComponent(CoreComponentIds.Position, component);
    };
    public replacePosition(x:number, y:number) {
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

    /** resource component */
    static _resourceComponentPool = [];
    static clearResourceComponentPool() {
        GameEntity._resourceComponentPool.length = 0;
    };
    public get resource(): ResourceComponent {
        return <ResourceComponent>this.getComponent(CoreComponentIds.Resource);
    }
    public get hasResource(): boolean {
        return this.hasComponent(CoreComponentIds.Resource);
    }
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

    /** 玩家组件 */
    static playerComponent: PlayerComponent;
    public get isPlayer(): boolean {
        return this.hasComponent(CoreComponentIds.Player);
    }
    public set isPlayer(value: boolean) {
        if (value !== this.isPlayer) {
            if (value) {
                this.addComponent(CoreComponentIds.Player, GameEntity.playerComponent);
            } else {
                this.removeComponent(CoreComponentIds.Player);
            }
        }
    }
    public setPlayer(value: boolean) {
        this.isPlayer = value;
        return this;
    };

    /** sprite component */
    static _spriteComponentPool = [];
    public get sprite(): SpriteComponent {
        return <SpriteComponent>this.getComponent(CoreComponentIds.Sprite);
    }
    public get hasSprite(): boolean {
        return this.hasComponent(CoreComponentIds.Sprite);
    }
    static clearSpriteComponentPool = function () {
        GameEntity._spriteComponentPool.length = 0;
    };
    public addSprite(layer:number, object:Object) {
        var component = GameEntity._spriteComponentPool.length > 0 ? GameEntity._spriteComponentPool.pop() : new SpriteComponent();
        component.layer = layer;
        component.object = object;
        return <GameEntity>this.addComponent(CoreComponentIds.Sprite, component);
    };
    public replaceSprite(layer:number, object:Object) {
        var previousComponent = this.hasSprite ? this.sprite : null;
        var component = GameEntity._spriteComponentPool.length > 0 ? GameEntity._spriteComponentPool.pop() : new SpriteComponent();
        component.layer = layer;
        component.object = object;
        this.replaceComponent(CoreComponentIds.Sprite, component);
        if (previousComponent != null) {
            GameEntity._spriteComponentPool.push(previousComponent);
        }
        return this;
    };
    public removeSprite() {
        var component = this.sprite;
        this.removeComponent(CoreComponentIds.Sprite);
        GameEntity._spriteComponentPool.push(component);
        return this;
    };
}