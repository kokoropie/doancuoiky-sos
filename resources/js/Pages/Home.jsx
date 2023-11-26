import { useEffect, useState } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import Layout from "@/Layouts/Layout";
import Modal from "@/Components/Modal";
import HeroSvg from "../../assets/Hero.svg";
import InputSvg from "../../assets/Input.svg";
import RegisterSvg from "../../assets/Register.svg";
import HeaderBoxSvg from "../../assets/HeaderBox.svg";
import AboutContentTopPng from "../../assets/AboutContentTop.png";
import AboutContentCenterPng from "../../assets/AboutContentCenter.png";
import AboutContentBottomPng from "../../assets/AboutContentBottom.png";
import SOSTeamSvg from "../../assets/SOSTeam.svg";
import BenefitContentUnderBottomPng from "../../assets/BenefitContentUnderBottom.png";
import LeftSvg from "../../assets/Left.svg";
import RightSvg from "../../assets/Right.svg";
import FooterSvg from "../../assets/Footer.svg";
import trangGiayPng from "../../assets/trangGiay.png";
import { toast } from "react-toastify";


export default function Home() {
    const [examCode, setExamCode] = useState("");
    const [showModalLogin, setShowModalLogin] = useState(false);
    const [showModalRegister, setShowModalRegister] = useState(false);

    const formLogin = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const formRegister = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const handleJoinExam = () => {
        if (examCode.length == 0) {
            toast("Please input exam code!", {
                type: 'error',
                position: 'bottom-right',
                autoClose: 2000,
            });
            return;
        } else if (examCode.length != 10) {
            toast("Exam code must be 10 characters!", {
                type: 'error',
                position: 'bottom-right',
                autoClose: 2000,
            });
            return;
        }
        router.get(route('exam.short', examCode), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    }

    useEffect(() => {
        formLogin.reset();
    }, [showModalLogin]);

    useEffect(() => {
        formRegister.reset();
    }, [showModalRegister]);

    return (
        <Layout showLogin={setShowModalLogin} showRegister={setShowModalRegister}>
            <Head title="Home" />
            <div>
                <div className="pt-16 px-[5%] md:px-[10%] lg:px-[20%]">
                    <img src={HeroSvg} />
                </div>
                <div className="pt-12 px-[6%] md:px-[11%] lg:px-[22%]">
                    <div className="relative md:mb-2">
                        <img src={InputSvg} />
                        <div className="absolute h-full w-[35%] cursor-pointer top-0 right-0" onClick={handleJoinExam}></div>
                        <input onKeyDown={(e) => {
                            if (e.key == 'Enter') {
                                handleJoinExam();
                            }
                        }} className="absolute -translate-y-1/2 top-1/2 left-0 w-[65%] text-center border-none bg-transparent max-[300px]:text-sm min-[300px]:text-lg min-[400px]:text-xl sm:text-3xl md:text-4xl lg:text-3xl focus:ring-0" placeholder="Input Exam Code" value={examCode} onChange={(e) => setExamCode(e.target.value)} maxLength={10} />
                    </div>
                    <span className="text-xs sm:text-sm md:text-xl lg:text-2xl bg-white">My friends, do well in your exams!</span>
                </div>
                <div className="w-full flex justify-end">
                    <div className="cursor-pointer max-w-[35%]" onClick={() => setShowModalRegister(true)}>
                        <img src={RegisterSvg} />
                    </div>
                </div>
                <div className="pt-12 px-[5%] md:px-[10%] lg:px-[20%]">
                    <div className="relative mb-1">
                        <img src={HeaderBoxSvg} />
                        <span className="absolute top-1/2 left-0 text-center w-[55%] -translate-y-1/2 text-white max-[300px]:text-sm min-[300px]:text-lg min-[400px]:text-xl sm:text-3xl md:text-4xl lg:text-3xl text-border">BENEFITS FOR YOU</span>
                    </div>
                    <div className="grid sm:grid-cols-2">
                        {[
                            [
                                "Create and manage multiple-choice exams easily", 
                                "Ensure that teachers, learners and administrators have the ability to create and manage multiple-choice exams easily, quickly and effectively."
                            ], 
                            [
                                "Security and anti-cheating",
                                "Ensuring the security of exam questions and the multiple-choice exam process, preventing cheating and ensuring fairness in knowledge assessment."
                            ], 
                            [
                                "Support for online learning",
                                "Provide a convenient and flexible online learning environment, helping learners participate in remote exams without barriers."
                            ], 
                            [
                                "Save time and effort",
                                "Support users to save time and effort in preparing, organizing and participating in multiple-choice exams."
                            ]].map((item, index) => <div key={index} className="relative flex border border-black  rounded-bl-3xl rounded-tr-3xl bg-cover bg-center" style={{
                                backgroundImage: `url(${trangGiayPng})`
                            }}>
                                <p className="text-center text-sm md:text-base px-5 py-2 my-auto">
                                    <b>{item[0]}: </b> 
                                    <span>{item[1]}</span>
                                </p>
                                <img src={BenefitContentUnderBottomPng} className="absolute w-1/2 bottom-0 left-1/2 -translate-x-1/2 translate-y-full z-[1]" />
                        </div>)}
                    </div>
                </div>
                <div id="about" className="pt-12 px-[5%] md:px-[10%] lg:px-[20%]">
                    <div className="relative mb-1">
                        <img src={HeaderBoxSvg} />
                        <span className="absolute top-1/2 left-0 text-center w-[55%] -translate-y-1/2 text-white max-[300px]:text-sm min-[300px]:text-lg min-[400px]:text-xl sm:text-3xl md:text-4xl lg:text-3xl text-border">About SOS Team</span>
                    </div>
                    <div>
                        <img src={AboutContentTopPng} />
                        <div className="relative bg-repeat-y bg-contain" style={{
                            backgroundImage: `url(${AboutContentCenterPng})`
                        }}>
                            <p className="break-words text-sm md:text-base lg:text-base px-5 sm:px-10">
                                <b>We are the boys of the Academy of Cryptography Techniques, we are:</b>
                                <br />
                                Nguyễn Văn Tùng
                                <br />
                                Trần Thanh Trí
                                <br />
                                Dương Phúc Nghĩa
                                <br />
                                Huỳnh Minh Thuận
                                <br />
                                Nguyễn Bá Trung
                            </p>
                            <img src={SOSTeamSvg} className="w-4/5 mx-auto sm:mx-0 sm:absolute sm:right-10 sm:-bottom-10 sm:w-2/5" />
                        </div>
                        <img src={AboutContentBottomPng} />
                    </div>
                </div>
                <div>
                    <img src={FooterSvg} className="w-full h-auto" />
                </div>
                <div className="absolute top-10 left-0 -z-10 hidden sm:block max-w-[20%]">
                    <img src={LeftSvg} />
                </div>
                <div className="absolute top-44 right-0 -z-10 hidden sm:block max-w-[20%]">
                    <img src={RightSvg} />
                </div>
            </div>
            

            <Modal
                show={showModalLogin}
                onClose={() => setShowModalLogin(false)}
                className="relative rounded-lg pb-0"
            >
                <div className="absolute w-full h-full bg-black z-[-20] mt-2 rounded-lg ml-2 top-0 left-0" />
                <div className="border-2 border-[#0068FF] flex flex-col bg-white rounded-lg">
                    <div className="my-6 text-center">
                        <span className="font-bold text-2xl bg-gradient-to-r from-[#0068FF] to-[#02C166] text-transparent" style={{
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>Login</span>
                    </div>
                    <form className="w-full">
                        <div className="flex flex-col md:flex-row justify-center items-start leading-10 text-xl px-3">
                            <p className="w-1/4">Email:</p>
                            <div className="w-[55%] max-md:w-full flex flex-col">
                                <input
                                    className="border rounded-md border-[#0068FF] w-full"
                                    placeholder="Email"
                                    type="email"
                                    value={formLogin.data.email}
                                    onChange={(e) => formLogin.setData('email', e.target.value)}
                                />
                                <small className="text-sm text-red-500">{formLogin.errors.email}</small>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row justify-center items-start leading-10 text-xl mt-3 px-3">
                            <p className="w-1/4">Password:</p>
                            <div className="w-[55%] max-md:w-full flex flex-col">
                                <input
                                    className="border rounded-md border-[#0068FF]"
                                    placeholder="Password"
                                    type="password"
                                    value={formLogin.data.password}
                                    onChange={(e) => formLogin.setData('password', e.target.value)}
                                    autoComplete="current-password"
                                />
                                <small className="text-sm text-red-500">{formLogin.errors.password}</small>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row justify-center items-start leading-10 text-xl mt-3 px-3">
                            <p className="w-1/4"></p>
                            <div className="w-[55%] max-md:w-full flex items-center">
                                <input type="checkbox" id="remember" checked={formLogin.data.remember} onChange={(e) => formLogin.setData('remember', e.target.checked)} />
                                <label htmlFor="remember" className="text-sm ml-1">Remeber Me</label>
                            </div>
                        </div>
                    </form>
                    <div className="flex items-center justify-center space-x-2">
                        <button
                            onClick={() => {
                                formLogin.post(route('login'));
                            }}
                            className="mt-8 bg-gradient-to-r from-[#0068FF] to-[#02C166] py-2 px-4 rounded-full text-white mb-8"
                        >Login</button>
                        <button
                            onClick={() => {
                                setShowModalLogin(false);
                                setShowModalRegister(true);
                            }}
                            className="mt-8 bg-gradient-to-r to-[#0068FF] from-[#02C166] py-2 px-4 rounded-full text-white mb-8"
                        >Register</button>
                    </div>
                </div>
            </Modal>
            <Modal
                show={showModalRegister}
                onClose={() => setShowModalRegister(false)}
                className="relative rounded-lg pb-0"
            >
                <div className="absolute w-full h-full bg-black z-[-20] mt-2 rounded-lg ml-2 top-0 left-0" />
                <div className="border-2 border-[#0068FF] flex flex-col bg-white rounded-lg">
                    <div className="my-6 text-center">
                        <span className="font-bold text-2xl bg-gradient-to-r from-[#0068FF] to-[#02C166] text-transparent" style={{
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>Register</span>
                    </div>
                    <form className="w-full">
                        <div className="flex flex-col md:flex-row justify-center items-start leading-10 text-xl mt-3 px-3">
                            <p className="w-1/4">Name:</p>
                            <div className="w-[55%] max-md:w-full flex flex-col">
                                <input
                                    className="border rounded-md border-[#0068FF]"
                                    placeholder="Name"
                                    type="text"
                                    value={formRegister.data.name}
                                    onChange={(e) => formRegister.setData('name', e.target.value)}
                                />
                                <small className="text-sm text-red-500">{formRegister.errors.name}</small>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row justify-center items-start leading-10 text-xl mt-3 px-3">
                            <p className="w-1/4">Email:</p>
                            <div className="w-[55%] max-md:w-full flex flex-col">
                                <input
                                    className="border rounded-md border-[#0068FF]"
                                    placeholder="Email"
                                    type="email"
                                    value={formRegister.data.email}
                                    onChange={(e) => formRegister.setData('email', e.target.value)}
                                />
                                <small className="text-sm text-red-500">{formRegister.errors.email}</small>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row justify-center items-start leading-10 text-xl mt-3 px-3">
                            <p className="w-1/4">Password:</p>
                            <div className="w-[55%] max-md:w-full flex flex-col">
                                <input
                                    className="border rounded-md border-[#0068FF]"
                                    placeholder="Password"
                                    type="password"
                                    value={formRegister.data.password}
                                    onChange={(e) => formRegister.setData('password', e.target.value)}
                                />
                                <small className="text-sm text-red-500">{formRegister.errors.password}</small>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row justify-center items-start leading-10 text-xl mt-3 px-3">
                            <p className="w-1/4">Password Confirmation:</p>
                            <div className="w-[55%] max-md:w-full flex flex-col">
                                <input
                                    className="border rounded-md border-[#0068FF]"
                                    placeholder="Password"
                                    type="password"
                                    value={formRegister.data.password_confirmation}
                                    onChange={(e) => formRegister.setData('password_confirmation', e.target.value)}
                                />
                                <small className="text-sm text-red-500">{formRegister.errors.password_confirmation}</small>
                            </div>
                        </div>
                    </form>
                    <div className="flex items-center justify-center space-x-2">
                        <button
                            onClick={() => {
                                formRegister.post(route('register'));
                            }}
                            className="mt-8 bg-gradient-to-r from-[#0068FF] to-[#02C166] py-2 px-4 rounded-full text-white mb-8"
                        >Register</button>
                        <button
                            onClick={() => {
                                setShowModalRegister(false);
                                setShowModalLogin(true);
                            }}
                            className="mt-8 bg-gradient-to-r to-[#0068FF] from-[#02C166] py-2 px-4 rounded-full text-white mb-8"
                        >Login</button>
                    </div>
                </div>
            </Modal>
        </Layout>
    );
}