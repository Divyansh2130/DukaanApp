import { useState } from "react"
import { BottomWarning } from "../components/BottomWarning"
import { Button } from "../components/Button"
import { Heading } from "../components/Heading"
import { InputBox } from "../components/InputBox"
import { SubHeading } from "../components/SubHeading"
import AlertDialogSlide from "../components/AlertDialogBox"
import { useNavigate } from "react-router-dom";
import axios from "axios"

export const Signin = () => {
    const [username,setUsername] =useState("");
    const [password,setPassword] =useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [open, setOpen] = useState(false);
    const navigate=useNavigate();

    const handleClickOpen = (message) => {
      setErrorMessage(message);
      setOpen(true);
  };

  const handleClose = () => {
      setOpen(false);
  };

    return <div className="bg-slate-300 h-screen flex justify-center">
    <div className="flex flex-col justify-center">
      <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
        <Heading label={"Sign in"} />
        <SubHeading label={"Enter your credentials to access your account"} />
        <InputBox onChange={(e)=>{setUsername(e.target.value)}} placeholder="Email" label={"Email"} />
        <InputBox onChange={(e)=>{setPassword(e.target.value)}}placeholder="password" label={"Password"} />
        <div className="pt-4">
          <Button onClick={async ()=>{
            try {
              const response=await axios.put("http://localhost:3000/api/v1/user/signin",
                {
                  username,
                  password  
                }
            )
             console.log(response);
             console.log(response.data.token);
              localStorage.setItem("token", response.data.token);
              navigate("/dashboard");
          } catch (error) {
              console.log(error);
              if (error.response && error.response.data.message) {
                  handleClickOpen(error.response.data.message);
              } else {
                  handleClickOpen("An unexpected error occurred.");
              }
          }
          }} label={"Sign in"} />
        </div>
        <BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/signup"} />
      </div>
    </div>
    <AlertDialogSlide message={errorMessage} open={open} handleClose={handleClose}></AlertDialogSlide>
  </div>
}