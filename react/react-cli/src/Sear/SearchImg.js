
import './index.css'
export default function SearchImg(props) {
    const {data:{ name:names, url:urls }} = props
    return (
        <div className="listContent">
            <h1>{names}</h1>
            <img className='getImg' src={urls} alt={"图片" + names} title={"图片" + names} />
        </div>
    )
}
