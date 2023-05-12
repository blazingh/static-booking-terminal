import styles from "./result.module.css";
import { useState, useEffect } from "react";
const Result = ({ data, firmInfo }) => {
  const [status, setStatus] = useState("pending");

  console.log(data, firmInfo);

  useEffect(() => {
    const request = async () => {
      const req = await fetch(
        "https://betaapi.dtsanalpos.com/api/clinic/terminal/addnewapp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            patient_id: data.user.id,
            firm_id: firmInfo.id,
            doctor_id: data.doctor.id,
            slot: data.appointment.id,
          }),
        }
      ).then((res) => res.json());

      if (req?.message == "Success") {
        setStatus("success");
      } else {
        setStatus("fail");
      }
    };
    request();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.result}>{status}</div>
      {status === "success" && (
        <div className={styles.result}>
          <svg
            width="50"
            height="50"
            viewBox="0 0 50 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M25 1C11.7621 1 1 11.7621 1 25C1 38.2379 11.7621 49 25 49C38.2379 49 49 38.2379 49 25C49 11.7621 38.2379 1 25 1ZM25 46.0695C13.3789 46.0695 3.93053 36.6211 3.93053 25C3.93053 13.3789 13.3789 3.93053 25 3.93053C36.6211 3.93053 46.0695 13.3789 46.0695 25C46.0695 36.6211 36.6211 46.0695 25 46.0695Z"
              fill="#099832"
              stroke="#099832"
            />
            <path
              d="M36.6594 16.3314L22.4334 31.408L15.194 23.7358C14.4852 22.9846 13.3209 22.9846 12.6121 23.7358C11.9034 24.4869 11.9034 25.7208 12.6121 26.472L21.1172 35.4856C21.4718 35.8613 21.9273 36.0758 22.4334 36.0758C22.9398 36.0758 23.3954 35.8613 23.7496 35.4856L39.2413 19.0676C39.9501 18.3165 39.9501 17.0826 39.2413 16.3314C38.5329 15.5803 37.4191 15.5803 36.6594 16.3314Z"
              fill="#099832"
              stroke="#099832"
            />
          </svg>
          <div className={styles.text}>
            <span className={styles.span}>Teşekkürler</span>
            <span className={styles.span}>
              Randevu Talebiniz Onaylanmıştır.
            </span>
          </div>
          <div className={styles.group1}>Randevu Bilgileri</div>
          <div className={styles.group2}>
            <span className={styles.span}>{data.doctor?.clinic.name}</span>
            <span className={styles.span}>
              {`${data.doctor?.degree?.tr} ${data.doctor?.name} ${data.doctor?.surname}`}
            </span>
            <span className={styles.span}>{`${data.doctor?.branch?.tr}`}</span>
            <span className={styles.span}>
              {`${data.appointment?.date.split("-")[2]} ${data.appointment?.monthName
                }, Saat ${data.appointment?.time}`}
            </span>
          </div>
          <div className={styles.group3}>
            <span className={styles.name + " " + styles.span}>
              {`${data.user?.name} ${data.user?.surname}`}
            </span>
            <span className={styles.phone + " " + styles.span}>
              {data.user?.phone}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Result;
