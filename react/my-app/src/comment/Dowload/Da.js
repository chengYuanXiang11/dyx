import { useSelector} from 'react-redux'
export default function Dowload() {
    const data = useSelector(state=>{
        console.log('da',state);
        return state.nameReducer
    },()=>false)
    return(
        <>
        <br />
        th--------------------
        <br />

                {data.name}{data.title}
                <br />

        th--------------------

                <br />

        </>
    )
  }
