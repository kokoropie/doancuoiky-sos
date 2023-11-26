import { useEffect, useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import HeaderSvg from "../../assets/Header.svg";
import ButtonMenuSvg from "../../assets/ButtonMenu.svg";
import XSvg from "../../assets/X.svg";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Layout({ children, showLogin = () => {}, showRegister = () => {} }) {
    const { auth, flash } = usePage().props;
    const [ showMenu, setShowMenu ] = useState(false);
    useEffect(() => {
        if (flash.toast) {
            toast(flash.toast.message, flash.toast.config ?? {});
        }
    }, [flash])
    return (
        <div>
            <div className="hidden sm:block mt-[40px] px-[10%]">
                <div className="h-[60px] relative">
                    <div className="absolute w-full h-full top-2 left-2 bg-black rounded-full" />
                    <div className="border-2 border-black absolute w-full h-full rounded-full z-10 bg-white flex justify-around items-center px-12">
                        <Link href="/home">HOME</Link>
                        <a href="#about">ABOUT</a>
                        {!auth.user && <div
                            className="hover:cursor-pointer"
                            onClick={() => showLogin(true)}
                        >
                            LOGIN
                        </div>}
                        {auth.user && <Link href={route('profile.edit')}>PROFILE</Link>}
                    </div>
                </div>
            </div>
            <div className="sm:hidden flex justify-between items-center">
                <img src={HeaderSvg} className="w-[90%]" />
                <img src={ButtonMenuSvg} className="w-[8%] mx-2" onClick={() => setShowMenu(true)} />
                {showMenu && <div className="fixed top-0 right-0 left-0 bottom-0 bg-white/50 z-20" onClick={() => setShowMenu(false)}>
                <ul className="border-black border float-right text-2xl bg-white py-4">
                    <div
                        className="flex justify-end mb-2 mr-6"
                        onClick={() => setShowMenu(false)}
                        >
                        <img src={XSvg} className="w-8" />
                    </div>
                    <Link
                        href="/"
                        className="block px-6 py-2 border-[#ccc] border"
                        onClick={() => setShowMenu(false)}
                    >
                        HOME
                    </Link>
                    <a
                        className="block px-6 py-2 border-[#ccc] border"
                        onClick={() => setShowMenu(false)}
                        href="#about"
                    >
                        ABOUT
                    </a>
                    {!auth.user && <div
                        className="block px-6 py-2 border-[#ccc] border cursor-pointer"
                        onClick={() => {
                            setShowMenu(false);
                            showLogin(true);
                        }}
                        >
                        LOGIN
                    </div>}
                    {auth.user && <Link href={route('profile.edit')} className="block px-6 py-2 border-[#ccc] border">PROFILE</Link>}
                </ul>
                </div>}
            </div>
            {children}
            <ToastContainer />
        </div>
    );
}
