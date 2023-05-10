import styles from "./page.module.css";
import { useState, useEffect } from "react";

const AppModal = ({ closeModal }) => {
    const [data, setData] = useState({});

    const [firmInfo, setFirmInfo] = useState({});

    const [doctors, setDoctors] = useState([]);

    const [appointments, setAppointments] = useState([]);

    let url = "";
    if (typeof window !== "undefined" && window.location.href) {
        url = window.location.href
            .split("/")
            .slice(0, 3)
            .join("/")
            .replace(/\/$/, "");
    }

    const getFirmInfo = async () => {
        setFirmInfo({
            name: "Firm Name",
            logo: "https://via.placeholder.com/150",
            id: "1",
        });
    };

    useEffect(() => {
        getFirmInfo();
    }, []);

    return (
        <div className={styles.AppModal}>
            <div className={styles.Content}>
                <div className={styles.LogoHeader}>
                    <div
                        className={styles.HeaderItem}
                        style={{ justifyContent: "flex-start" }}>
                        <img
                            src={`https://dtsanalpos.com/assets/img/logo-colorfull.png`}
                            className={styles.Logo}
                            alt="logo"
                        />
                    </div>
                    <div className={styles.HeaderItem}>
                        <span className={styles.HeaderTitle}>
                            {firmInfo?.name || ""}
                        </span>
                    </div>
                    <div
                        className={styles.HeaderItem}
                        style={{ justifyContent: "flex-end" }}>
                        <img
                            src={`https://dtsanalpos.com/assets/img/sanalpost_logo.png`}
                            className={styles.secondaryLogo}
                            alt="logo"
                        />
                    </div>
                </div>
                <button className={styles.CloseButton} onClick={closeModal}>
                    X
                </button>
            </div>
        </div>
    );
};

export default AppModal;
