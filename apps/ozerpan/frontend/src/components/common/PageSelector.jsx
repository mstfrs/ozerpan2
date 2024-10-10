import { ChevronRight,ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
  const PageSelector=({previous,next,currentPage,totalPages})=> {
    return (
   <div className="flex items-center gap-2">
    <Button variant="outline" size="icon" disabled={currentPage===0} > 
      <ChevronLeft className="h-4 w-4" onClick={previous} />
    </Button>
    <span className="text-slate-700">{currentPage+1} of {totalPages}</span>
<Button variant="outline" size="icon" disabled={currentPage===totalPages}>
      <ChevronRight className="h-4 w-4" onClick={next}/>
    </Button>
   </div>
    )
  }
  
  export default PageSelector