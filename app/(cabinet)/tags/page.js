import Counter from "../../components/counter/Counter";
import Targets from "../../components/targets/Targets";
import styles from './tags.module.css';
import Managetags from "@/app/components/managetags/Managetags";
import Tagstable from "@/app/components/tagstable/Tagstable";

export default function Cards() {
  return (
    <main>
      <Managetags />
      <Tagstable />
    </main>
  )
}
