import styles from "./user.module.css";
import Timer from "./timer";
import { useState, useEffect } from "react";
function InputTemplate({
  type = "text",
  label,
  error,
  value,
  onChange,
  children,
}) {
  return (
    <div style={{ width: "100%" }}>
      <div
        className={
          styles.inputcontainer +
          " " +
          (value && !error ? styles.inputfilled : "") +
          " " +
          (!value ? styles.inputempty : "") +
          " " +
          (error ? styles.inputerror : "")
        }
      >
        <label className={value ? styles.labelfilled : styles.label}>
          {label}
        </label>
        <input
          style={{ background: "transparent", border: "none" }}
          className={styles.input}
          type={type}
          value={value}
          onChange={onChange}
        />
        {children}
      </div>
      {error && (
        <label className={styles.errors + " " + styles.label}>{error}</label>
      )}
    </div>
  );
}

const UserInfo = ({ doctorId, slot, firmId, onSuccess }) => {
  const [values, setValues] = useState({ terms1: true, terms2: true });
  const [errors, setErrors] = useState({});
  const [sms, setSms] = useState({ sent: false, id: null, loading: false });

  const updateValue = (item, value) => {
    setValues((p) => ({ ...p, [item]: value }));
  };
  const updateError = (item, value) => {
    setErrors((p) => ({ ...p, [item]: value }));
  };

  const validate = () => {
    console.log(values);
    setErrors({});
    if (
      values.name &&
      values.surname &&
      values.phoneNumber &&
      values.code &&
      values.hash &&
      values.terms1 &&
      values.terms2
    ) {
      return true;
    }
    if (values.valide) updateValue("valide", false);
    if (!values.name) updateError("name", "bu alan gereklidir");
    if (!values.surname) updateError("surname", "bu alan gereklidir");
    if (!values.id_no) updateError("id_no", "bu alan gereklidir");
    if (!values.hash) updateError("id", "bu alan gereklidir");
    if (!values.phoneNumber) updateError("phoneNumber", "bu alan gereklidir");
    if (!values.code) updateError("code", "bu alan gereklidir");
    if (!values.terms1 || !values.terms2)
      updateError("terms", "bu alan gereklidir");
    if (!values.date?.valide) updateError("date", "bu alan gereklidir");
    if (!values.valide) updateValue("valide", true);
    return false;
  };

  useEffect(() => {
    if (!values.date?.day || !values.date?.month || !values.date?.year) {
      if (values.date?.valide) handleDateChange("valide", false);
    } else if (!values.date?.valide)
      handleDateChange(
        "valide",
        `${values.date?.day}/${values.date?.month}/${values.date?.year}`
      );
  }, [values.date]);

  useEffect(() => {
    if (
      values.name &&
      values.surname &&
      values.id_no &&
      values.phoneNumber &&
      values.code &&
      values.hash &&
      values.terms1 &&
      values.terms2 &&
      values.date?.valide
    ) {
      if (!values.valide) updateValue("valide", true);
    } else if (values.valide) updateValue("valide", false);
  }, [values]);

  const handlePhoneChange = (e) => {
    const prob = [];
    if (!/^[0-9]+$/.test(e.target.value) && e.target.value !== "")
      prob.push("Sadece sayılar");
    if (e.target.value.length > 11) return e.preventDefault();
    updateError("phone", prob[0]);
    return updateValue("phoneNumber", e.target.value);
  };
  const handleIdChange = (e) => {
    const prob = [];
    if (e.target.value.length > 11) return e.preventDefault();
    updateError("id", prob[0]);
    return updateValue("id_no", e.target.value);
  };
  const handleCodeChange = (e) => {
    const prob = [];
    if (!/^[0-9]+$/.test(e.target.value) && e.target.value !== "")
      prob.push("Sadece sayılar");
    if (e.target.value.length > 6) return e.preventDefault();
    updateError("code", prob[0]);
    return updateValue("code", e.target.value);
  };

  const handleRegister = async () => {
    if (!validate()) return;
    updateValue("loading", true);
    updateValue("error", false);

    const request = await fetch(
      "https://betaapi.dtsanalpos.com/api/register-after-hash",
      {
        method: "POST",
        body: JSON.stringify({
          ...values,
          smsCode: values.code,
          phone: values.phoneNumber,
          firm_id: firmId,
        }),
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      }
    );

    const data = await request.json();

    if (data.message === "Success" && data.result) {
      updateValue("loading", false);
      if (typeof onSuccess === "function") onSuccess(data.result);
    } else {
      updateValue("loading", false);
      if (data?.errors?.[0]?.translations?.id.includes("errors_user_TC"))
        setErrors((p) => ({
          ...p,
          id_no:
            "Kişi bilgileri ile T.C. Kimlik No eşleşmemektedir. Lütfen kontrol ediniz.",
        }));
      else
        updateValue(
          "error",
          data?.errors?.[0]?.description || "error registering"
        );
    }
  };

  const handleSmsSend = async () => {
    setSms((p) => ({ ...p, loading: true, error: false }));
    const request = await fetch("https://betaapi.dtsanalpos.com/api/hash-sms", {
      method: "POST",
      body: JSON.stringify({ phone: values.phoneNumber }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    const data = await request.json();
    if (data.message === "Success" && data.result.hash) {
      setSms((p) => ({
        ...p,
        sent: true,
        hash: data.result.hash,
        loading: false,
      }));
      updateValue("hash", data.result.hash);
    } else {
      setSms((p) => ({
        ...p,
        loading: false,
        error: "",
      }));
    }
  };

  return (
    <div className={styles.registercontainer}>
      {/* name and surname inputs */}
      <div className={styles.nameandsurname}>
        {/* user name */}
        <InputTemplate
          error={errors.name}
          label="Ad"
          value={values.name}
          onChange={(e) => updateValue("name", e.target.value)}
        />

        {/* user surname */}
        <InputTemplate
          error={errors.surname}
          label="Soyad"
          value={values.surname}
          onChange={(e) => updateValue("surname", e.target.value)}
        />
      </div>

      {/* id input */}
      <InputTemplate
        error={errors.id_no}
        label="T.C. Kimlik No"
        value={values.id_no}
        onChange={handleIdChange}
      />

      {/* phone number input */}
      <InputTemplate
        error={sms.error || errors.phoneNumber || errors.hash}
        label="Telefon Numarası"
        value={values.phoneNumber}
        onChange={handlePhoneChange}
      >
        <button
          type="button"
          onClick={() =>
            values.phoneNumber?.length >= 10 &&
            !errors.phone &&
            !sms.sent &&
            handleSmsSend()
          }
          className={styles.smscodebutton}
          style={{
            backgroundColor:
              values.phoneNumber?.length >= 10 &&
                !errors.phone &&
                !sms.sent &&
                values.phoneNumber
                ? "#5D5FEF"
                : "#D6D6D6",
          }}
        >
          {sms.sent ? (
            <Timer
              sec={300}
              time="05:00"
              onTimeout={() => {
                setSms((p) => ({ ...p, sent: false }));
              }}
            />
          ) : (
            !sms.loading && "Gönder"
          )}
          {sms.loading && "..."}
        </button>
      </InputTemplate>

      {/* sms code input */}
      <InputTemplate
        error={errors.code}
        label={"SMS Kodu"}
        value={values.code}
        onChange={handleCodeChange}
      />

      {/* terms of service */}
      <div className={styles.terms}>
        <div className={styles.term}>
          <a href="https://distedavim.com/w/kullanim-kosullari" target="_blank">
            Kullanım Koşulları
          </a>
        </div>
        <div className={styles.term}>
          <a href="https://distedavim.com/w/kvkk" target="_blank">
            KVKK Aydınlatma Metni
          </a>
        </div>
        {errors.terms && (
          <label className={styles.errors + styles.label}>{errors.terms}</label>
        )}
      </div>

      {/* submit button */}
      <button
        type="button"
        className={styles.submitbutton}
        onClick={handleRegister}
      >
        {values.loading ? "..." : "Randevuyu Onayla"}
      </button>
      {values.error && (
        <div
          className={styles.errors}
          style={{ display: "flex", justifyContent: "center", marginLeft: 0 }}
        >
          {values.error}
        </div>
      )}
    </div>
  );
};

export default UserInfo;
