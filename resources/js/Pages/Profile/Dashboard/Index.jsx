import { Head, Link } from "@inertiajs/react";
import Layout from "@/Layouts/Layout";

export default function Index({ auth, exams_count, joined_exams_count, results_count }) {
    return (
        <Layout>
            <Head title="Dashboard" />
            <div className="mt-[40px] px-[10%]">
                <h1 className="font-extrabold text-4xl">Welcome, {auth.user.name}</h1>
            </div>
            <div className="mt-10 mx-[10%] bg-[#F1F1F1] rounded-lg px-3 py-2">
                <div className="flex space-x-5 text-xl mb-4">
                    <Link href={route("profile.exams.index")} className="hover:border-b-2 border-cyan-500">
                        Exams
                    </Link>
                    <Link href={route("profile.edit")} className="hover:border-b-2 border-cyan-500">
                        Information
                    </Link>
                    <Link href={route('profile.dashboard.index')} className="border-b-2 border-cyan-500">
                        Dashboard
                    </Link>
                </div>
                <hr className="border-black" />
                <div className="grid sm:grid-cols-2">
                    <div>
                        Exams: {exams_count}
                    </div>
                    <div>
                        Joined exams: {joined_exams_count}
                    </div>
                    <div>
                        Number of who joined your exams (not count guest): {results_count}
                    </div>
                </div>
            </div>
        </Layout>
    );
}