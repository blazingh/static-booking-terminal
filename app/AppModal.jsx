import styles from "./page.module.css";
import { useState, useEffect } from "react";
import SvgUserGrey from "./icons/userGrey";
import SvgCheck from "./icons/check";
import SvgCallendarActive from "./icons/callendarActive";
import SvgCallendarGrey from "./icons/callendarGrey";
import SvgDoctorActive from "./icons/doctorActive";
import SvgUserActive from "./icons/userActive";
import SvgAccordian from "./icons/accordian";
import StatusBar from "./components/statusBar";

const AppModal = ({ closeModal }) => {
    const [data, setData] = useState({
        step: 1,
        doctor: {
            id: 1,
            name: "Dr. Ahmet Yılmaz",
        },
        appoitment: {
            id: 1,
            readable: "12.12.2021 12:00",
        },
        user: {
            id: 1,
            name: "Ahmet",
            surname: "Yılmaz",
        },
    });

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
                {/* header */}
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

                {/* status bar */}
                <StatusBar
                    step={data.step}
                    user={data.user}
                    appointment={data.appoitment}
                    doctor={data.doctor}
                />

                {/* content */}
                <button
                    type="button"
                    className={styles.Button}
                    onClick={() => {
                        setData((prev) => ({ ...prev, step: prev.step + 1 }));
                    }}>
                    add
                </button>

                <button
                    type="button"
                    className={styles.Button}
                    onClick={() => {
                        setData((prev) => ({ ...prev, step: prev.step - 1 }));
                    }}>
                    remove
                </button>

                <SvgCheck />
                <SvgDoctorActive />
                <SvgCallendarGrey />
                <SvgCallendarActive />
                <SvgUserGrey />
                <SvgUserActive />
                <button className={styles.CloseButton} onClick={closeModal}>
                    X
                </button>
            </div>
        </div>
    );
};

export default AppModal;
