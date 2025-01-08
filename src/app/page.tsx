
import styles from "./page.module.css";
import MyMap from '../components/Map';

export default function Home() {
  return (
    <main className={styles.page}>
      <MyMap/>
    </main>
  );
}
