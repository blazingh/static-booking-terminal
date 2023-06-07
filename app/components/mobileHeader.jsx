import styles from "./mobileHeader.module.css";
const MobileHeader = ({ firm }) => {
  return (
    <div className={styles.LogoHeader}>
      <div className={styles.Row}>
        <div
          className={styles.HeaderItem}
          style={{ justifyContent: "flex-start" }}
        >
          <img
            src={`https://dtsanalpos.com/assets/img/logo-colorfull.png`}
            className={styles.Logo}
            alt="logo"
          />
        </div>
        <div
          className={styles.HeaderItem}
          style={{ justifyContent: "flex-end" }}
        >
          <img
            src={
              firm?.files?.["logo.image"]?.tr?.[0].file
                ? `https://dtsanalpos.com/${firm?.files?.["logo.image"]?.tr?.[0].file}`
                : `https://dtsanalpos.com/assets/img/logo-colorfull.png`
            }
            className={styles.secondaryLogo}
            alt="logo"
          />
        </div>
      </div>
      <div className={styles.Row}>
        <span className={styles.HeaderTitle}>{firm?.name || ""}</span>
      </div>
    </div>
  );
};

export default MobileHeader;
