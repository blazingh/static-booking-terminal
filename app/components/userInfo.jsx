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
  const [values, setValues] = useState({ terms1: false, terms2: false });
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
    if (!values.name) updateError("name", "registerPage.required");
    if (!values.surname) updateError("surname", "registerPage.required");
    if (!values.id_no) updateError("id_no", "registerPage.required");
    if (!values.hash) updateError("id", "registerPage.required");
    if (!values.phoneNumber)
      updateError("phoneNumber", "registerPage.required");
    if (!values.code) updateError("code", "registerPage.required");
    if (!values.terms1 || !values.terms2)
      updateError("terms", "registerPage.required");
    if (!values.date?.valide) updateError("date", "registerPage.required");
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
          firm_id: 1,
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
          <button
            className={styles.checkbox}
            type="button"
            onClick={() => {
              updateValue("terms1", !values.terms1);
            }}
          >
            {values.terms1 ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="0.5"
                  y="0.5"
                  width="23"
                  height="23"
                  rx="7.5"
                  fill="#5D5FEF"
                  stroke="#DBD1F8"
                />
                <path
                  d="M17.426 7.2774L10.2339 14.7015L6.57401 10.9235C6.2157 10.5536 5.62706 10.5536 5.26874 10.9235C4.91042 11.2934 4.91042 11.901 5.26874 12.2709L9.56852 16.7094C9.74777 16.8944 9.97808 17 10.2339 17C10.49 17 10.7203 16.8944 10.8993 16.7094L18.7313 8.62479C19.0896 8.25491 19.0896 7.64729 18.7313 7.2774C18.3731 6.90753 17.81 6.90753 17.426 7.2774Z"
                  fill="white"
                  stroke="white"
                />
              </svg>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="0.5"
                  y="0.5"
                  width="23"
                  height="23"
                  rx="7.5"
                  fill="#F4F4F4"
                  stroke="#DBD1F8"
                />
              </svg>
            )}
          </button>
          <span>terms and conditions 1</span>
        </div>
        <div className={styles.term}>
          <button
            className={styles.checkbox}
            type="button"
            onClick={() => {
              updateValue("terms2", !values.terms2);
            }}
          >
            {values.terms2 ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="0.5"
                  y="0.5"
                  width="23"
                  height="23"
                  rx="7.5"
                  fill="#5D5FEF"
                  stroke="#DBD1F8"
                />
                <path
                  d="M17.426 7.2774L10.2339 14.7015L6.57401 10.9235C6.2157 10.5536 5.62706 10.5536 5.26874 10.9235C4.91042 11.2934 4.91042 11.901 5.26874 12.2709L9.56852 16.7094C9.74777 16.8944 9.97808 17 10.2339 17C10.49 17 10.7203 16.8944 10.8993 16.7094L18.7313 8.62479C19.0896 8.25491 19.0896 7.64729 18.7313 7.2774C18.3731 6.90753 17.81 6.90753 17.426 7.2774Z"
                  fill="white"
                  stroke="white"
                />
              </svg>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="0.5"
                  y="0.5"
                  width="23"
                  height="23"
                  rx="7.5"
                  fill="#F4F4F4"
                  stroke="#DBD1F8"
                />
              </svg>
            )}
          </button>
          <span>terms and conditions 2</span>
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
        {values.loading ? "..." : "Kayıt Ol"}
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
