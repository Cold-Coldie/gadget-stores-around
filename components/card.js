import Image from "next/image";
import Link from "next/link";
import styles from "./Card.module.css";
import classNames from "classnames";

const Card = ({ href, name, imageUrl }) => {
  return (
    <Link className={styles.cardLink} href={href}>
      <div className={classNames("glass", styles.container)}>
        <div className={styles.cardHeaderWrapper}>
          <h2 className={styles.cardHeader}>{name}</h2>
        </div>

        <div className={styles.cardImageWrapper}>
          <Image
            className={styles.cardImage}
            src={imageUrl && imageUrl}
            width={260}
            height={160}
            alt={name + " " + "image"}
          />
        </div>
      </div>
    </Link>
  );
};

export default Card;
