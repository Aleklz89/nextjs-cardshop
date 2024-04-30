import Counter from "../../components/counter/Counter";
import Targets from "../../components/targets/Targets";
import styles from './level.css';

export default function Cards() {
  return (
    <main>
      <div className={styles.dashboard}>
        <Counter />
        <Targets />
      </div>
    </main>
  )
}
