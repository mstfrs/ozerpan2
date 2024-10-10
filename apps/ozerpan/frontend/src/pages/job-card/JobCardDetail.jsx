import { useNavigate, useParams } from "react-router-dom";
import {   useFrappeGetDoc, useFrappeGetDocList, useSWRConfig } from "frappe-react-sdk";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TimeLogs from "../../components/job-card/TimeLogs";
import { useState } from "react";
import {Dialog} from "../../components/ui/dialog"
import Modal from "../../components/Modal";
import CompletedModal from "../../components/CompletedModal";

const JobCardDetail = () => {
  const { id } = useParams(); // URL'den id al
  const { data: jobCard, error } = useFrappeGetDoc("Job Card", id, "jobcarddetails");
  const { data: employees } = useFrappeGetDocList('Employee', {
    fields: ['*'],  // Tüm alanları almak için ["*"] kullanıyoruz
  });
  console.log('Employees', employees)
  const [jobCardId, setJobCardId] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Dialog için state
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false); // Dialog için state
  const [selectedReason, setSelectedReason] = useState(""); 
  const [totalCount, setTotalCount] = useState()
  const { mutate } = useSWRConfig();
  const navigate=useNavigate()


  if (error) return <div>Error loading job card details</div>;
  if (!jobCard) return <div>Loading...</div>;



  // PUT isteği ile güncelleme yapacak fonksiyon
  const updateJobLog = async (timeLogId, updatedPayload) => {
    try {
      const response = await fetch(`/api/resource/Job Card Time Log/${timeLogId}`, {
        method: "PUT",
        credentials:'include',
        headers: {
          "Content-Type": "application/json",
          //"Authorization": `token 6d76e6b39cc7a4d:f63543ae0fad40f`, // API anahtarı ve gizli anahtar
        },
        body: JSON.stringify(updatedPayload),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }

      const data = await response.json();
      console.log("Job card updated successfully:", data);
    } catch (error) {
      console.error("Error updating job card:", error);
    }
  };

  const updateJobCardStatus = async (joCardId, payload) => {
    try {
      const response = await fetch(`/api/resource/Job Card/${joCardId}`, {
        method: "PUT",
        credentials:'include',
        headers: {
          "Content-Type": "application/json",
          //"Authorization": `token 6d76e6b39cc7a4d:f63543ae0fad40f`, // API anahtarı ve gizli anahtar
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }

      const data = await response.json();
      console.log("Job card updated successfully:", data);
    } catch (error) {
      console.error("Error updating job card:", error);
    }
  };

  function formatDateToCustomFormat(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  const handleJobAction = async (jobCard) => {
    console.log(jobCard)
    setLoading(true);
    try {
      if (jobCard.status === 'Work In Progress') {
        // Eğer duraklatılmışsa devam ettir
        const timeLogId = jobCard.time_logs[jobCard.time_logs.length - 1].name;
        const updatedPayload = {
          to_time: formatDateToCustomFormat(new Date().toISOString()), // Bitirme zamanı güncelleniyor
          custom_reason:selectedReason,
        };
        await updateJobLog(timeLogId, updatedPayload);
        await updateJobCardStatus(jobCard.name, { is_paused: 1,status:"On Hold" });
        console.log("Job card paused successfully.");
      } else if (jobCard.status === 'Open') {
    
        const timeLogPayload = {
          job_card: jobCard.name,
          from_time: formatDateToCustomFormat(new Date().toISOString()),
          to_time: null,
          employee: employees[0]?.name,
          completed_qty: 0,
          idx: jobCard.time_logs.length + 1,
          parent: jobCard.name,
          parenttype: "Job Card",
          parentfield: "time_logs",
        };

        await fetch("http://localhost:8001/api/resource/Job Card Time Log", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `token 6d76e6b39cc7a4d:f63543ae0fad40f`,
          },
          body: JSON.stringify(timeLogPayload),
        });

        await updateJobCardStatus(jobCard.name, { is_paused: 0,status:"Work in Progress",employee:[{"employee": employees[0]?.name}] });
        console.log("Job card resumed successfully.");
      }
      else {
        const timeLogPayload = {
          job_card: jobCard.name,
          from_time: formatDateToCustomFormat(new Date().toISOString()),
          to_time: null,
          employee: jobCard.employee[0].employee,
          completed_qty: 0,
          idx: jobCard.time_logs.length + 1,
          parent: jobCard.name,
          parenttype: "Job Card",
          parentfield: "time_logs",
        };

        await fetch("http://localhost:8001/api/resource/Job Card Time Log", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `token 6d76e6b39cc7a4d:f63543ae0fad40f`,
          },
          body: JSON.stringify(timeLogPayload),
        });

        await updateJobCardStatus(jobCard.name, { is_paused: 0,status:"Work in Progress" });
        console.log("Job card resumed successfully.");
      }
    } catch (error) {
      console.error("Error handling job action:", error);
    } finally {
      mutate("jobcarddetails");
      setLoading(false);
    }
  };

  const handleJobCardInput = (e) => {
    setJobCardId(e.target.value);

    if (e.target.value.toLowerCase() === "pause") {
      handleJobAction(jobCard);
      setJobCardId("")
    }
  };
  const handleJobComplete = async(jobCard) => {
    const timeLogId = jobCard.time_logs[jobCard.time_logs.length - 1].name;
    const updatedPayload = {
      to_time: formatDateToCustomFormat(new Date().toISOString()), // Bitirme zamanı güncelleniyor
      completed_qty:1,
      parent: jobCard.name,
      parenttype: "Job Card",
      parentfield: "time_logs", 

    };
    await updateJobCardStatus(jobCard.name, { status:"Completed"});
    await updateJobLog(timeLogId, updatedPayload);
    
    await mutate("jobcarddetails");
  };

  return (
    <div>
      <button className="bg-gray-400 py-1 px-4 rounded-md my-2 items-start" onClick={()=>navigate('/jobcard')}>Job Card Listesi</button>
      {/* Input elementi */}
      <div className="relative">
        <input
          id="text"
          name="jobcardId"
          type="text"
          className="peer placeholder-transparent h-10 w-full  border-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
          placeholder="Scan Job Card Barcode"
          onChange={handleJobCardInput}
          value={jobCardId}
          disabled={loading} // İşlem sırasında input devre dışı
        />
        <label
          htmlFor="jobcardId"
          className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
        >
          Job Card Id
        </label>
      </div>
      <div className={`${!isDialogOpen&&"hidden"} `}>
      <Modal     isOpen={isDialogOpen} 
      onClose={() => setIsDialogOpen(false)} 
      onConfirm={() => {
        handleJobAction(jobCard);  // jobCard parametresini fonksiyona ilet
        setIsDialogOpen(false);  // Modal'i kapat
      }} 
      setSelectedReason={setSelectedReason} 
      selectedReason={selectedReason}/>
      </div>
    <CompletedModal isOpen={isCompleteDialogOpen}  onClose={() => setIsCompleteDialogOpen(false)} 
      onConfirm={() => {
        handleJobComplete(jobCard);  // jobCard parametresini fonksiyona ilet
        setIsCompleteDialogOpen(false);  // Modal'i kapat
      }} 
      setTotalCount={setTotalCount}
      totalCount={totalCount}/>
      <Table>
        <TableCaption>A list of your projects.</TableCaption>
        <TableHeader>
          <TableRow className="text-left">
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>BOM No</TableHead>
            <TableHead>Item Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Expected Start</TableHead>
            <TableHead>Expected Finish</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow key={jobCard.name} className="text-left">
            <TableCell className="font-medium">{jobCard.name}</TableCell>
            <TableCell>{jobCard.bom_no}</TableCell>
            <TableCell>{jobCard.item_name}</TableCell>
            <TableCell>{jobCard.status}</TableCell>
            <TableCell>{jobCard.expected_start_date}</TableCell>
            <TableCell>{jobCard.expected_end_date}</TableCell>
            <TableCell>
             <div className="flex gap-2 itemx-center">
             <button
                className={`px-4 py-1 rounded-lg ${jobCard?.status === "On Hold" ? "bg-green-300" : jobCard?.status === "Work In Progress" ? "bg-red-300" : "bg-blue-300"}`}
                onClick={() =>jobCard.status==="Work In Progress"?setIsDialogOpen(true): handleJobAction(jobCard)}
                disabled={loading} // Loading durumunda buton devre dışı
              >
                {loading ? "Loading..." : jobCard?.status === "On Hold" ? "Devam Et" : jobCard?.status === "Work In Progress" ? "Durdur" : "Başlat"}
              </button>
              {
                jobCard?.status==="Work In Progress"&&
                <button
                className={`px-4 py-1 rounded-lg bg-blue-300`}
              onClick={() => setIsCompleteDialogOpen(true)}
                disabled={loading} // Loading durumunda buton devre dışı
              >
                {loading ? "Loading..." : "Complete"}
              </button>
              }
             </div>
            

            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <TimeLogs className="mt-10" times={jobCard?.time_logs} employee={jobCard?.employee[0]?.employee} />
    </div>
  );
};

export default JobCardDetail;
