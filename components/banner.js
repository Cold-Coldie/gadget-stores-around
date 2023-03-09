import styles from "./Banner.module.css";

const Banner = ({ buttonText, handleOnClick }) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <span className={styles.title1}>Gadget</span>
        <span className={styles.title2}>Connoiseur</span>
      </h1>

      <p className={styles.subTitle}>Discover your local gadget stores!</p>

      <div className={styles.buttonWrapper}>
        <button className={styles.button} onClick={handleOnClick}>
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default Banner;
