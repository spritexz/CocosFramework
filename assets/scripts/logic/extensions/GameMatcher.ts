import { Matcher } from "../../lib/ecs/Matcher";
import { CoreComponentIds } from "../components/CoreComponentIds";

export class GameMatcher extends Matcher {

    /** 资源匹配器 */
    public static _matcherPlayer = null;
    public static get Player(): GameMatcher {
        if (GameMatcher._matcherPlayer == null) {
            GameMatcher._matcherPlayer = GameMatcher.allOf(CoreComponentIds.Player);
        }
        return GameMatcher._matcherPlayer;
    }

    /** 坐标匹配器 */
    public static _matcherPosition = null;
    public static get Position(): GameMatcher {
        if (GameMatcher._matcherPosition == null) {
            GameMatcher._matcherPosition = GameMatcher.allOf(CoreComponentIds.Position);
        }
        return GameMatcher._matcherPosition;
    }

    /** 资源匹配器 */
    public static _matcherResource = null;
    public static get Resource(): GameMatcher {
        if (GameMatcher._matcherResource == null) {
            GameMatcher._matcherResource = GameMatcher.allOf(CoreComponentIds.Resource);
        }
        return GameMatcher._matcherResource;
    }

    /** Sprite匹配器 */
    public static _matcherSprite = null;
    public static get Sprite(): GameMatcher {
        if (GameMatcher._matcherSprite == null) {
            GameMatcher._matcherSprite = GameMatcher.allOf(CoreComponentIds.Resource);
        }
        return GameMatcher._matcherSprite;
    }
}