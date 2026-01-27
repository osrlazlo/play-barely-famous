import { useContext } from "react"
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from "react-icons/ai"
import { ThemeContext } from "../../../App"

interface SelectAmountProps {
    name:string
    setValue:React.Dispatch<React.SetStateAction<number>>
    value:number
    min:number
    max:number
}
export default function SelectAmount({name, setValue, value, min, max}:SelectAmountProps) {
    
    function increaseValue() {
        if (value >= max) {
            setValue(max)
            return
        }
        setValue(v => v+1)
    }
    function reduceValue() {
        if (value <= min) {
            setValue(min)
            return
        }
        setValue(v => v-1)
    }
    const{theme} = useContext(ThemeContext)
    return(
        <div className="num-select">
            <span>Select the number of {name} ({min}-{max})</span>
            <div className="num-container">
                <div className="icon"><AiOutlineMinusCircle size={"35px"} onClick={() => reduceValue()}/></div>                     
                   <div className={"num" + theme}>{value}</div> 
                <div className="icon"><AiOutlinePlusCircle size={"35px"} onClick={() => increaseValue()}/></div>  
            </div>
        </div>
    )
}