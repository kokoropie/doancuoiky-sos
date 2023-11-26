import { Link, router } from "@inertiajs/react";
import { useEffect } from "react";

export default function Result({ flash }) {
    useEffect(() => {
        if (!flash.result) {
            router.get(route('home'));
        }
    }, [flash]);
    return (
        <div id="result" className="flex w-screen h-screen">
            <div className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fixed">
                <div className="absolute w-full h-full bg-black -z-10 mt-2 rounded-lg ml-2 top-0 left-0" />
                <div className="rounded-lg border border-cyan-500 bg-white px-3 py-5">
                    <div className="text-xl text-center">
                        <p>Congratulations on completing the exam!</p>
                        <p>You get {flash.result.count_correct}/{flash.result.count_questions}</p>
                        <p>Score: {flash.result.result}</p>
                    </div>
                    <div className="w-full text-center mt-5">
                        <Link href={route('home')} className="bg-gradient-to-b from-[#02C166] to-[#0068FF] px-3 py-2 rounded text-white">Home</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}