import styles from "./SimpleLoader.module.css";

const SimpleLoader = ({ text }: { text?: string }) => {
  return (
    <div className={`${styles.container}`}>
      <div className={`${styles.loader}`}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <p className={`${styles.text}`}>{text}</p>
    </div>
  );
};

export default SimpleLoader;
