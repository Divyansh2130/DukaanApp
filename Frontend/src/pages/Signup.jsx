import { useState } from "react";
import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AlertDialogSlide from "../components/AlertDialogBox";

export const Signup = () => {
    const [firstName, setFirstName] = useState("");
    const [userNo, setUserNo] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const handleClickOpen = (message) => {
        setErrorMessage(message);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div className="bg-slate-300 h-screen flex justify-center">
            <div className="flex flex-col justify-center">
                <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
                    <Heading label={"Sign up"} />
                    <SubHeading label={"Enter your information to create an account"} />
                    <InputBox
                        onChange={(e) => {
                            setUsername(e.target.value);
                        }}
                        placeholder="Your Email"
                        label={"Email"}
                    />
                    <InputBox
                        onChange={(e) => {
                            setFirstName(e.target.value);
                        }}
                        placeholder="Name"
                        label={"First Name"}
                    />
                    <InputBox
                        onChange={(e) => {
                            setUserNo(e.target.value);
                        }}
                        placeholder="Phone No."
                        label={"User No."}
                    />
                    <InputBox
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                        placeholder="min 6 digits"
                        label={"Password"}
                    />
                    <div className="pt-4">
                        <Button
                            onClick={async () => {
                                try {
                                    const response = await axios.post("http://localhost:3000/api/v1/user/signup", {
                                        username,
                                        firstName,
                                        userNo,
                                        password,
                                    });
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
                            }}
                            label={"Sign up"}
                        />
                    </div>
                    <BottomWarning label={"Already have an account?"} buttonText={"Sign in"} to={"/signin"} />
                </div>
            </div>
            <AlertDialogSlide message={errorMessage} open={open} handleClose={handleClose} />
        </div>
    );
};
