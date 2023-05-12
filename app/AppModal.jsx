import styles from "./page.module.css";
import { useState, useEffect, useRef } from "react";
import StatusBar from "./components/statusBar";
import Header from "./components/header";
import DoctorSelection from "./components/doctorSelection";
import DateSelection from "./components/dateSelection";
import UserInfo from "./components/userInfo";
import MobileHeader from "./components/mobileHeader";
import Result from "./components/result";
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

    const divRef = useRef(null);

    const [firmInfo, setFirmInfo] = useState({});

    let screenWidth = null;

    if (typeof window !== "undefined" && window.screen.width) {
        screenWidth = window.innerWidth;
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
            `https://betaapi.dtsanalpos.com/api/firm/getbyurl?url=${url}`
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

    const scrollToBottom = () => {
        if (divRef?.current) {
            divRef?.current.scroll({
                top: divRef?.current.scrollHeight,
                behavior: "smooth",
            });
        }
    };

    useEffect(() => {
        if (divRef?.current) {
            divRef?.current.scroll({
                top: 0,
                behavior: "smooth",
            });
        }
    }, [data.step]);

    const handleUserSuccess = async (user) => {
        console.log(data);
        setData((prev) => ({ ...prev, user, step: 4 }));
    };

    return (
        <div className={styles.AppModal}>
            <div className={styles.Content}>
                {/* header */}
                {screenWidth > 950 && <Header firm={firmInfo} />}
                {screenWidth <= 950 && <MobileHeader firm={firmInfo} />}

                {/* status bar */}
                <StatusBar
                    setStep={(step) => setData((prev) => ({ ...prev, step }))}
                    step={data.step}
                    user={data.user}
                    appointment={data.appointment}
                    doctor={data.doctor}
                />

                {/* content */}
                <div className={styles.ContentContainer} ref={divRef}>
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
                    {data.step === 2 && (
                        <DateSelection
                            scrollToBottom={scrollToBottom}
                            clinicId={firmInfo?.id}
                            doctorId={data.doctor?.id}
                            handleAppointmentSelection={(appointment) => {
                                setData((prev) => ({ ...prev, appointment, step: 3 }));
                            }}
                        />
                    )}
                    {data.step === 3 && (
                        <UserInfo
                            firmId={firmInfo?.id}
                            doctorId={data.doctor?.id}
                            slot={data.appointment?.id}
                            onSuccess={handleUserSuccess}
                        />
                    )}
                    {data.step === 4 && <Result data={data} />}
                </div>
                <button
                    type="button"
                    className={styles.Button}
                    onClick={() => {
                        setData((prev) => ({ ...prev, step: prev.step + 1 }));
                    }}
                >
                    add
                </button>

                <button
                    type="button"
                    className={styles.Button}
                    onClick={() => {
                        setData((prev) => ({ ...prev, step: prev.step - 1 }));
                    }}
                >
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
