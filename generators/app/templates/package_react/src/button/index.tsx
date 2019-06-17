import * as React from 'react';

import * as styles from './index.scss';

export interface Props {
    text?: string;
    children?: any;
}

export default class Button extends React.PureComponent<Props> {
    render() {
        return (
            <div className={styles.cButton} onClick={() => console.log(this.props.text)}>
                <button>Hello World</button>
            </div>
        );
    }
}
