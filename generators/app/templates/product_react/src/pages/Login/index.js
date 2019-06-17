import styles from './index.scss';
import PureComponent from '$components/PureComponent/index';

export default class Login extends PureComponent {
  state = {};

  render(){
    return (
      <div className={styles.normal}>
        <h1>Page index</h1>
      </div>
    );
  }
}
