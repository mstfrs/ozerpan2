import { useFrappeGetDocCount } from "frappe-react-sdk"
import PageSelector from "./PageSelector"

const Pagination = ({doctype,filters,pageLimitStart,setPageLimitStart}) => {
    const PAGE_LENGTH=20
    const {data}=useFrappeGetDocCount(doctype,filters)
    const totalPages=Math.ceil((data ??0)/PAGE_LENGTH)
    const currentPage=pageLimitStart / PAGE_LENGTH 
    
const next=()=>{

setPageLimitStart((p)=>{
    const newPageLimitStart=pageLimitStart+PAGE_LENGTH
    if (newPageLimitStart>(data??0)) {
        return p
        
    }
    return newPageLimitStart
})
}

const previous=()=>{
    setPageLimitStart((p)=>{
        const newPageLimitStart=pageLimitStart-PAGE_LENGTH
        if (newPageLimitStart<0) {
            return p
            
        }
        return newPageLimitStart
    })
}
  return (
    <PageSelector 
    currentPage={currentPage}
    totalPages={totalPages}
    previous={previous}
    next={next}/>
  )
}

export default Pagination
