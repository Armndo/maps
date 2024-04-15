import { benito } from "../../assets";
import "./Loader.css"

export function Loader({loading}) {
    return loading && <div className="loader">
        <span>
            <img src={benito} alt="loader"/>
        </span>
    </div>
}