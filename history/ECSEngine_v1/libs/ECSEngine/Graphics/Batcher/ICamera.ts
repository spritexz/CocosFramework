import { Component } from "../../ECS/Component";
import { Rectangle } from "../../Math/Rectangle";


export interface ICamera extends Component {
    bounds: Rectangle;
}

