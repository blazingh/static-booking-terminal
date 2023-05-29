import styles from "./header.module.css";
const Header = ({ firm }) => {
    return (
        <div className={styles.LogoHeader}>
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
            <div className={styles.HeaderItem}>
                <span className={styles.HeaderTitle}>{firm?.name || ""}</span>
            </div>
            <div className={styles.HeaderItem} style={{ justifyContent: "flex-end" }}>
                <img
                    src={
                        firm?.files?.["logo.image"]?.tr?.[0].file
                            ? `https://betaapi.dtsanalpos.com/${firm?.files?.["logo.image"]?.tr?.[0].file}`
                            : ``
                    }
                    className={styles.secondaryLogo}
                />
            </div>
        </div>
    );
};

export default Header;
