import PureComponent from '$components/PureComponent/index';

import styles from './index.scss';

export default class <%= componentName %> extends PureComponent {
    constructor(props){
        super(props)
        this.state = {};     
    }

    render() {
        return (
            <div className={styles.normal}>
                <h1>hello,<%= componentName %></h1>
            </div>
        );
    }
}
