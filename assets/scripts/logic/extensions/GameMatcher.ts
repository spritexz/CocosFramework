import { Matcher } from "../../lib/ecs/Matcher";
import { CoreComponentIds } from "../components/CoreComponentIds";

export class GameMatcher extends Matcher {

    public static _matcherMovable = null;
    public static get Movable(): GameMatcher {
        if (GameMatcher._matcherMovable == null) 
            GameMatcher._matcherMovable = GameMatcher.allOf(CoreComponentIds.Movable);
        return GameMatcher._matcherMovable;
    }

    public static _matcherPosition = null;
    public static get Position(): GameMatcher {
        if (GameMatcher._matcherPosition == null) 
            GameMatcher._matcherPosition = GameMatcher.allOf(CoreComponentIds.Position);
        return GameMatcher._matcherPosition;
    }

    public static _matcherDestroy = null;
    public static get Destroy(): GameMatcher {
        if (GameMatcher._matcherDestroy == null) 
            GameMatcher._matcherDestroy = GameMatcher.allOf(CoreComponentIds.Destroy);
        return GameMatcher._matcherDestroy;
    }

    public static _matcherGameBoardCache = null;
    public static get GameBoardCache(): GameMatcher {
        if (GameMatcher._matcherGameBoardCache == null) 
            GameMatcher._matcherGameBoardCache = GameMatcher.allOf(CoreComponentIds.GameBoardCache);
        return GameMatcher._matcherGameBoardCache;
    }

    public static _matcherGameBoard = null;
    public static get GameBoard(): GameMatcher {
        if (GameMatcher._matcherGameBoard == null) 
            GameMatcher._matcherGameBoard = GameMatcher.allOf(CoreComponentIds.GameBoard);
        return GameMatcher._matcherGameBoard;
    }

    public static _matcherGameBoardElement = null;
    public static get GameBoardElement(): GameMatcher {
        if (GameMatcher._matcherGameBoardElement == null) 
            GameMatcher._matcherGameBoardElement = GameMatcher.allOf(CoreComponentIds.GameBoardElement);
        return GameMatcher._matcherGameBoardElement;
    }

    public static _matcherInput = null;
    public static get Input(): GameMatcher {
        if (GameMatcher._matcherInput == null) 
            GameMatcher._matcherInput = GameMatcher.allOf(CoreComponentIds.Input);
        return GameMatcher._matcherInput;
    }

    public static _matcherInteractive = null;
    public static get Interactive(): GameMatcher {
        if (GameMatcher._matcherInteractive == null) 
            GameMatcher._matcherInteractive = GameMatcher.allOf(CoreComponentIds.Interactive);
        return GameMatcher._matcherInteractive;
    }

    public static _matcherResource = null;
    public static get Resource(): GameMatcher {
        if (GameMatcher._matcherResource == null) 
            GameMatcher._matcherResource = GameMatcher.allOf(CoreComponentIds.Resource);
        return GameMatcher._matcherResource;
    }

    public static _matcherView = null;
    public static get View(): GameMatcher {
        if (GameMatcher._matcherView == null) 
            GameMatcher._matcherView = GameMatcher.allOf(CoreComponentIds.View);
        return GameMatcher._matcherView;
    }

    public static _matcherScore = null;
    public static get Score(): GameMatcher {
        if (GameMatcher._matcherScore == null) 
            GameMatcher._matcherScore = GameMatcher.allOf(CoreComponentIds.Score);
        return GameMatcher._matcherScore;
    }
}