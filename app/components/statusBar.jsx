import styles from "./statusBar.module.css";

import SvgUserGrey from "../icons/userGrey";
import SvgCheck from "../icons/check";
import SvgCallendarActive from "../icons/callendarActive";
import SvgCallendarGrey from "../icons/callendarGrey";
import SvgDoctorActive from "../icons/doctorActive";
import SvgUserActive from "../icons/userActive";
import SvgAccordian from "../icons/accordian";
const StatusBar = ({ step, user, appointment, doctor, setStep }) => {
    return (
        <div className={styles.AppointmenStatus}>
            {/* first step */}
            <div
                className={styles.StatusItem}
                onClick={() => {
                    if (step > 1) setStep(1);
                }}
            >
                {step === 1 ? <SvgDoctorActive /> : <SvgCheck />}
                {step > 1 && doctor?.id ? (
                    <div className={styles.StatusText}>
                        <span className={styles.StatusTitleGrey}>Hekim Seç</span>
                        <span className={styles.StatusDescription}>
                            {doctor?.name || ""}
                        </span>
                    </div>
                ) : (
                    <div className={styles.StatusText}>
                        <span className={styles.StatusTitle}>Hekim Seç</span>
                    </div>
                )}
            </div>

            <SvgAccordian />

            {/* second step */}
            <div
                className={styles.StatusItem}
                onClick={() => {
                    if (step > 1) setStep(2);
                }}
            >
                {step < 2 && <SvgCallendarGrey />}
                {step === 2 && <SvgCallendarActive />}
                {step > 2 && <SvgCheck />}

                {step > 2 && appointment?.id ? (
                    <div className={styles.StatusText}>
                        <span className={styles.StatusTitleGrey}>Randevu Tarihi Seç</span>
                        <span className={styles.StatusDescription}>
                            {`${appointment.date.split("-")[2]} ${appointment.monthName
                                }, saat: ${appointment.time}`}
                        </span>
                    </div>
                ) : (
                    <div className={styles.StatusText}>
                        <span className={styles.StatusTitle}>Randevu Tarihi Seç</span>
                    </div>
                )}
            </div>

            <SvgAccordian />

            {/* third step */}
            <div className={styles.StatusItem}>
                {step < 3 && <SvgUserGrey />}
                {step === 3 && <SvgUserActive />}
                {step > 3 && <SvgCheck />}
                {step > 3 && user?.id ? (
                    <div className={styles.StatusText}>
                        <span className={styles.StatusTitleGrey}>
                            Randevu Bilgilerini Gir
                        </span>
                        <span className={styles.StatusDescription}>
                            {user?.name || ""} {user?.surname || ""}
                        </span>
                    </div>
                ) : (
                    <div className={styles.StatusText}>
                        <span className={styles.StatusTitle}>Randevu Bilgilerini Gir</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatusBar;
