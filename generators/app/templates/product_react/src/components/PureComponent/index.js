import autoBind from '$utils/auto-bind';
import { classNameCombine } from '$utils/index';

/**
 * @classdesc 继承自 React本身的PureComponent，这里做了两件事，一是自动绑定this，不用每次在constructor中bind，二是混合了styles，配合module css使用
 */
export default class PureComponent extends React.PureComponent {
    constructor(props, styles) {
        super(props);
        autoBind(this);
        this.styles = classNameCombine(styles, props.styles);
    }
}
