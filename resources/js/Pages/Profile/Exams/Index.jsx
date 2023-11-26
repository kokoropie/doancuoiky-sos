import { Head, Link } from "@inertiajs/react";
import Layout from "@/Layouts/Layout";

export default function Index({ auth, exams }) {
    return (
        <Layout>
            <Head title="Exams" />
            <div className="mt-[40px] px-[10%]">
                <h1 className="font-extrabold text-4xl">Welcome, {auth.user.name}</h1>
            </div>
            <div className="mt-10 mx-[10%] bg-[#F1F1F1] rounded-lg px-3 py-2">
                <div className="flex space-x-5 text-xl mb-4">
                    <Link href={route("profile.exams.index")} className="border-b-2 border-cyan-500">
                        Exams
                    </Link>
                    <Link href={route("profile.edit")} className="hover:border-b-2 border-cyan-500">
                        Information
                    </Link>
                    <Link href={route('profile.dashboard.index')} className="hover:border-b-2 border-cyan-500">
                        Dashboard
                    </Link>
                </div>
                <hr className="border-black" />
                <div>
                    <ul>
                        <li className="flex items-center space-x-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24"><path fill="currentColor" d="M18 20v-3h-3v-2h3v-3h2v3h3v2h-3v3h-2ZM3 21q-.825 0-1.413-.588T1 19V5q0-.825.588-1.413T3 3h14q.825 0 1.413.588T19 5v5h-2V8H3v11h13v2H3Z"></path></svg>
                            <Link href={route('profile.exams.create')} className="hover:underline">Create new exam</Link>
                        </li>
                        {exams.map((exam, index) => <li key={index} className="flex items-center space-x-1">
                            {exam.status == "draft" && <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24"><path fill="currentColor" d="M20 2a1 1 0 0 1 1 1v3.757l-8.999 9l-.006 4.238l4.246.006L21 15.242V21a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h16Zm1.778 6.808l1.414 1.414L15.414 18l-1.416-.002l.002-1.412l7.778-7.778ZM12 12H7v2h5v-2Zm3-4H7v2h8V8Z"></path></svg>}
                            {exam.status == "publish" && <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24"><path fill="currentColor" d="M4.615 20q-.69 0-1.152-.462Q3 19.075 3 18.385V5.615q0-.69.463-1.152Q3.925 4 4.615 4h14.77q.69 0 1.152.463q.463.462.463 1.152v12.77q0 .69-.462 1.152q-.463.463-1.153.463H4.615Zm.885-3.5h4v-1h-4v1Zm9.05-2.212l4.238-4.238l-.713-.713l-3.525 3.55l-1.425-1.425l-.688.713l2.113 2.113ZM5.5 12.5h4v-1h-4v1Zm0-4h4v-1h-4v1Z"></path></svg>}
                            <Link className="hover:underline" href={route('profile.exams.edit', [exam.exam_id])}>{exam.title}</Link>
                        </li>)}
                    </ul>
                </div>
            </div>
        </Layout>
    );
}