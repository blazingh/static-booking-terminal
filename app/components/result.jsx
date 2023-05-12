import styles from "./result.module.css";

const Result = ({ data }) => {

  const [status, setStatus] = useState("pending");

  const useEffect(() => {

    const req = await fetch(
      "https://betaapi.dtsanalpos.com/api/clinic/terminal/addnewapp",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patient_id: user.id,
          firm_id: firmInfo.id,
          doctor_id: data.doctor.id,
          slots: data.appointment.id,
        }),
      }
    ).then((res) => res.json());

    if (req?.message == "Success") {
      setStatus("success");
    } else {
      setStatus("fail");
    }
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.result}>{status}</div>
    </div>
  );
};

export default Result;
