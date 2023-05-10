import styles from "./page.module.css";
import { useState, useEffect } from "react";
import StatusBar from "./components/statusBar";
import Header from "./components/header";
import DoctorSelection from "./components/doctorSelection";
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

    let screenWidth = null;
    if (typeof window !== "undefined" && window.screen.width) {
        screenWidth = window.screen.width;
    }

    let url = "";
    if (typeof window !== "undefined" && window.location.href) {
        url = window.location.href
            .split("/")
            .slice(0, 3)
            .join("/")
            .replace(/\/$/, "");
    }

    const getFirmInfo = async () => {
        const response = await fetch(
            `https://betaapi.dtsanalpos.com/api/firm/getbyurl?url=${url}`,
        );
        const data = await response.json();
        if (data?.message == "Success" && data?.result?.length > 0) {
            setFirmInfo(data.result[0]);
        } else {
            setFirmInfo({ fail: true });
        }
    };

    useEffect(() => {
        getFirmInfo();
    }, []);

    return (
        <div className={styles.AppModal}>
            <div className={styles.Content}>
                {/* header */}
                <Header firm={firmInfo} />

                {/* status bar */}
                <StatusBar
                    step={data.step}
                    user={data.user}
                    appointment={data.appoitment}
                    doctor={data.doctor}
                />

                {/* content */}
                <div className={styles.ContentContainer}>
                    {data.step === 1 && (
                        <DoctorSelection
                            firmId={firmInfo?.id}
                            onDoctorSelect={(doctor) =>
                                setData((prev) => ({
                                    ...prev,
                                    doctor,
                                    step: 2,
                                }))
                            }
                        />
                    )}
                </div>
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
                <button className={styles.CloseButton} onClick={closeModal}>
                    X
                </button>
            </div>
        </div>
    );
};

export default AppModal;
