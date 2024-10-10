import { useFrappeAuth } from "frappe-react-sdk";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const { login } = useFrappeAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await login({
        username: email,
        password: password,
      });
      navigate("/jobcard");
    } catch (error) {
      console.error("Login failed", error);
    }
  };






  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-sky-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-semibold">Login</h1>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="text"
                    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                    placeholder="Email address"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >
                    Email Address
                  </label>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                  />
                  <label
                    htmlFor="password"
                    className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >
                    Password
                  </label>
                </div>
                <div className="relative">
                  <button onClick={handleSubmit}>Submit</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;


//{ "job_card_id": "PO-JOB00144", "start_time": "2024-10-09+09:51:59", "employees": [{ "employee": "HR-EMP-00001" }], "status": "Work+In+Progress" }

//{"job_card_id":"PO-JOB00144","complete_time":"2024-10-09+09:53:26","status":"On+Hold"}

//{"job_card_id":"PO-JOB00144","start_time":"2024-10-09+09:54:15","employees":[{"name":"r44tjf8res","owner":"mustafa.ors@mail.juniuserp.com","creation":"2024-10-05+05:44:54.415900","modified":"2024-10-08+23:53:26.316618","modified_by":"mustafa.ors@mail.juniuserp.com","docstatus":0,"idx":1,"employee":"HR-EMP-00001","time_in_mins":0,"completed_qty":0,"parent":"PO-JOB00144","parentfield":"employee","parenttype":"Job+Card","doctype":"Job+Card+Time+Log"}],"status":"Resume+Job"}

//{"job_card_id":"PO-JOB00144","complete_time":"2024-10-09+09:54:36","status":"Complete","completed_qty":1}