import { useEffect, useState } from "react";
import styles from "./doctorSelection.module.css";
import DoctorCard from "./doctorCard";
const DoctorSelection = ({ firmId, onDoctorSelect }) => {
    const [doctors, setDoctors] = useState([]);

    const getDoctors = async () => {
        if (!firmId) return;
        const response = await fetch(
            `https://dtsanalpos.com/api/firms/clinic/doctors?clinic_id=${firmId}&page=1&rows_per_page=50`
        );
        const data = await response.json();

        if (data?.message == "Success" && data?.result?.data?.length > 0) {
            setDoctors(data.result.data);
        } else {
            setDoctors([]);
        }
    };
    const LANGUAGES = {
        en: "English",
        tr: "Türkçe",
        ar: "عربي",
        de: "Deutsch",
        fr: "Français",
    };
    useEffect(() => {
        getDoctors();
    }, [firmId]);
    const getLanguages = (langs) => {
        let spokenlang = "";
        // eslint-disable-next-line array-callback-return
        langs?.map((l, i) => {
            spokenlang +=
                i + 1 === langs.length
                    ? `${LANGUAGES[l] || ""} `
                    : `${LANGUAGES[l] || ""}, `;
        });
        return spokenlang;
    };

    if (doctors.length === 0)
        return <span className={styles.message}>Loading...</span>;
    return (
        <div className={styles.DoctorSelection}>
            {doctors.length === 0 && (
                <span className={styles.message}>Loading...</span>
            )}
            {doctors.length > 1 &&
                doctors.map((doctor) => (
                    <DoctorCard
                        key={doctor.id}
                        onSelect={() => onDoctorSelect(doctor)}
                        name={
                            doctor?.degree?.tr + " " + doctor?.name + " " + doctor?.surname
                        }
                        firm={doctor.branch?.tr}
                        image={`https://dtsanalpos.com/${doctor?.files?.["profile.image"]?.tr?.[0]?.file}`}
                        languages={getLanguages(doctor.spoken_languages)}
                    />
                ))}
        </div>
    );
};

export default DoctorSelection;
