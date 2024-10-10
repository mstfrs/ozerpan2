import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useFrappeAuth,
} from "frappe-react-sdk";
import Pagination from "../../components/common/Pagination";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../useAuthStore";

export const JobCards = () => {
  const [pageLimitStart, setPageLimitStart] = useState(0);
  const { currentUser, logout } = useFrappeAuth();
  const [jobCardId, setJobCardId] = useState(""); // input alanı için state
  const [jobCards, setJobCards] = useState([]); // jobCards state'i
  const [isUserLoaded, setIsUserLoaded] = useState(false); // Kullanıcı bilgisi yüklendi mi?
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser); // Store'dan setUser fonksiyonunu alıyoruz
  const user = useAuthStore((state) => state.user);
  const [loggedEmployee, setLoggedEmployee] = useState()

  // Job Card verilerini al
  const getJobCards = async () => {
    if (!user?.custom_workstation) return; // Kullanıcı bilgisi yüklü değilse dur
    try {
      const response = await fetch(
        `http://localhost:8001/api/resource/Job Card?fields=["*"]&filters=[["workstation", "=", "${user.custom_workstation}"]]&limit=20&limit_start=${pageLimitStart}`
      ,{
        method: "GET",
        credentials: 'include',
       // headers: {
          //Authorization: "token 6d76e6b39cc7a4d:f63543ae0fad40f", // Buraya uygun token ekleyin
      //  },
      });
      const data = await response.json();
      setJobCards(data.data);
    } catch (error) {
      console.error("Job Cards Fetch Error:", error);
    }
  };


  const getLoggedUserEmployeeDetails = async () => {
    try {
      // Kullanıcı email'ini kullanarak Employee ID'sini al
      const employeeResponse = await fetch(
        `http://localhost:8001/api/resource/Employee?filters=[["user_id","=","${currentUser}"]]`,
        {
          method: "GET",
          credentials:'include',
          headers: {
            //Authorization: "Bearer d94b8390a898c186c4c0b1887407a83f009e619577b3f3f32a53ea9e", // Buraya uygun token ekleyin
          },
        }
      );

      if (!employeeResponse.ok) {
        throw new Error("Failed to fetch employee ID");
      }

      const employeeData = await employeeResponse.json();
      console.log(employeeData)
      const employeeId =
        employeeData.data.length > 0 ? employeeData.data[0].name : null; // Employee ID'sini al

      if (!employeeId) {
        console.log("No employee found for this user.");
        return;
      }

      // Employee ID'sini kullanarak Employee detaylarını al
      const detailsResponse = await fetch(
        `http://localhost:8001/api/resource/Employee/${employeeId}`,
        {
          method: "GET",
          credentials:'include',

        //  headers: {
          //  Authorization: "token 6d76e6b39cc7a4d:f63543ae0fad40f", // Buraya uygun token ekleyin
        //  },
        }
      );

      if (!detailsResponse.ok) {
        throw new Error("Failed to fetch employee details");
      }

      const employeeDetails = await detailsResponse.json();
      setUser(employeeDetails.data);
      setLoggedEmployee(employeeDetails.data);
      setIsUserLoaded(true); // Kullanıcı bilgisi yüklendi
      console.log("Employee Details:", employeeDetails.data); // Employee bilgilerini konsola yazdır
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  useEffect(() => {
    getLoggedUserEmployeeDetails();
  }, []);

  useEffect(() => {
    if (isUserLoaded) {
      getJobCards(); // Kullanıcı yüklendiğinde job cards verilerini getir
    }
  }, [isUserLoaded, pageLimitStart]); // pageLimitStart değişince yeniden yükle


  const handleJobCardInput = (e) => {
    const inputValue = e.target.value;
    setJobCardId(inputValue); // input değerini güncelle

    const matchedJobCard = jobCards?.find((project) => project.name === inputValue);

    if (matchedJobCard) {
      navigate(`/jobcard/${matchedJobCard.name}`);
    }
  };

  return (
    <div className="p-2">
      <h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-3xl">
        Projects
      </h1>
      <div>
        Logged in as {currentUser}
        <div className="w-full flex justify-center">
          <button
            onClick={logout}
            className="flex items-center bg-white border border-gray-300 rounded-lg shadow-md px-6 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            <span>Logout</span>
          </button>
        </div>
      </div>
      <div className="flex justify-between my-4">
        <div className="relative">
          <input
            id="text"
            name="jobcardId"
            type="text"
            className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
            placeholder="Scan Job Card Barcode"
            onChange={handleJobCardInput} // onChange event'ine yeni fonksiyon
            value={jobCardId}
          />
          <label
            htmlFor="jobcardId"
            className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
          >
            Job Card Id
          </label>
        </div>
        <Pagination
          doctype="Job Card"
          pageLimitStart={pageLimitStart}
          setPageLimitStart={setPageLimitStart}
        />
      </div>

      <Table>
        <TableCaption>A list of your projects.</TableCaption>
        <TableHeader>
          <TableRow className="text-left">
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>BOM No</TableHead>
            <TableHead>Item Name</TableHead>
            <TableHead>Workstation</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Expected Start</TableHead>
            <TableHead>Expected Finish</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobCards?.map((project) => {
            return (
              <TableRow key={project.name} className="text-left">
                <TableCell className="font-medium">{project.name}</TableCell>
                <TableCell>{project.bom_no}</TableCell>
                <TableCell>{project.item_name}</TableCell>
                <TableCell>{project.workstation}</TableCell>
                <TableCell>{project.status}</TableCell>
                
                <TableCell>{project.expected_start_date}</TableCell>
                <TableCell>{project.expected_end_date}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default JobCards;
