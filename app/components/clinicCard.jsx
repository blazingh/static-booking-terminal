// import SvgLocation from "../icons/location";

import styles from "./clinicCard.module.css";

function NewClinicCard({ name, image, type, onSelect, location }) {
  return (
    <div className={styles.cardcontainer}>
      <div className={styles.imagecontainer} onClick={onSelect}>
        <img className={styles.img} src={image} />
      </div>
      <div className={styles.infocontainer}>
        <div
          style={{
            display: " flex",
            flexWrap: "wrap",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <div className={styles.texts} onClick={onSelect}>
            <span className={styles.name}>{name}</span>
            {/* <div className={styles.type}>{type}</div> */}
          </div>
          <span className={styles.location}>
            {/* <SvgLocation height={14} width={10} /> */}
            {location}
          </span>
        </div>
        <div className={styles.buttons}>
          <button className={styles.select} onClick={onSelect}>
            Seç
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewClinicCard;
