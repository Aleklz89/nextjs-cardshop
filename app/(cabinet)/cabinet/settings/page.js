import Gears from "../../../components/gears/Gears";
import Cardslist from "../../../components/cardlist/Cardslist";
import styles from './settings.css';

export default function Cards() {
  return (
    <main>
      <div className={styles.dashboard}>
        <Gears />
      </div>
    </main>
  )
}
