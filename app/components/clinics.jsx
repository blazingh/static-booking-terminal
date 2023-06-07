import NewClinicCard from "./clinicCard";

function ClinicSelection({ clinics, onSelect }) {
  return (
    <div>
      {clinics &&
        clinics.map((clinic) => (
          <NewClinicCard
            key={clinic.id}
            name={clinic.name}
            // type={clinic.clinic_type.tr}
            onSelect={() => onSelect(clinic)}
            location={`${clinic.city || clinic?.city_part || ""}, ${clinic.district
              }`}
            image={`https://dtsanalpos.com/${clinic?.files?.["logo.image"].tr[0].file}`}
          />
        ))}
    </div>
  );
}

export default ClinicSelection;
