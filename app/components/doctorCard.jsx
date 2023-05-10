
import styles from "./card.module.css"

function DoctorCard({ name, image, languages, onSelect, firm }) {
    return (
        <div className={styles.cardcontainer}>
            <div className={styles.imagecontainer} onClick={onSelect} >
                <img className={styles.img} src={image} alt="doctor"/>
            </div>
            <div className={styles.infocontainer} onClick={onSelect}buttpxn>
                <div className={styles.texts}>
                    <span className={styles.name}>
                        {name}
                    </span>
                    <span className={styles.clinic}>
                        {firm}
                    </span>
                    <span className={styles.langs}>
                        {languages}
                    </span>
                </div>
                <div className={styles.buttons}>
                    <button type="button" className={styles.select} onClick={onSelect} >Sec</button>
                </div>
            </div>
        </div>
    )
}


export default DoctorCard
