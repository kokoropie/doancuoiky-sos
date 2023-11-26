import Layout from "@/Layouts/Layout";
import { Head, Link } from "@inertiajs/react";

export default function Show ({ auth, exam }) {
    const duration = (s) => {
        let a = {
            h: 3600,
            m: 60,
            s: 1
        };
        let result = "";
        for (let key in a) {
            result += Math.floor(s / a[key]) + key + " ";
            s = s % a[key];
        }
        return result;
    }

    return (
        <Layout>
            <Head title={`${exam.title} Exam`} />
            <div className="mt-10 mx-[10%] flex items-start max-sm:flex-col select-none pb-10">
                <div className="bg-white rounded-lg w-full border border-black px-3 py-3">
                    <div>
                        <p>Exam: {exam.title}</p>
                        <p>Description: {exam.description}</p>
                        <p>Duration: {duration(exam.duration)}</p>
                        <p>Questions: {exam.questions_count}</p>
                        {!auth.user && <p className="text-red-500"><b>The result only saves if you logged</b></p>}
                        {auth.user && <p>Examinee: {auth.user.name}</p>}
                    </div>
                    <div className="mt-3 mb-2">
                        <Link href={route("exam.join", exam.exam_id)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">Join</Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
}