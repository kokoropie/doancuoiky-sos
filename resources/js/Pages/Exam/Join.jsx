import { useEffect, useState } from "react";
import { Head, router } from "@inertiajs/react";

export default function Join ({ auth, exam, questions, time_left }) {
    const [answers, setAnswers] = useState(localStorage.getItem(`answers-${exam.exam_id}`) ? JSON.parse(localStorage.getItem(`answers-${exam.exam_id}`)) : []);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [timeLeft, setTimeLeft] = useState(time_left);

    const handleSubmit = () => {
        localStorage.removeItem(`answers-${exam.exam_id}`);
        router.post(route('exam.submit', exam.exam_id), {
            answers: answers
        });
    }

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

    useEffect(() => {
        let i = setInterval(() => {
            setTimeLeft(timeLeft - 1);
        }, 1000);
        return () => {
            clearInterval(i);
        }
    });

    useEffect(() => {
        localStorage.setItem(`answers-${exam.exam_id}`, JSON.stringify(answers));
    }, [answers]);

    useEffect(() => {
        if (timeLeft <= 0) {
            handleSubmit();
        }
    }, [timeLeft]);

    return (
        <div className="mt-10 mx-[10%] flex items-start flex-col select-none pb-10">
            <Head title={`${exam.title} Exam`} />
            <div className="w-full">
                <h1 className="text-center text-3xl font-extrabold">
                    {exam.title}
                </h1>
                {auth.user && <div className="text-center">
                    Examinee: {auth.user.name}
                </div>}
                <div className="text-center text-red-500 font-bold">
                    Time left: {duration(timeLeft)}
                </div>
            </div>
            <div className="w-full mt-5 flex items-start max-sm:flex-col gap-5">
                <div className="w-full sm:w-3/4 border border-black px-2 py-1 bg-white">
                    <p><b>Question {currentQuestion + 1}:</b></p>
                    <p className="px-1">{questions[currentQuestion].question}</p>
                    <div className="mt-3 flex flex-col">
                        {questions[currentQuestion].answers.map((x, i) => <div key={i} className={`px-2 mb-2`} onClick={() => {
                            let newAnswers = [...answers];
                            newAnswers[currentQuestion] = i;
                            setAnswers(newAnswers);
                        }}>
                            <input type="radio" name="answer" checked={answers[currentQuestion] == i} onChange={() => {
                                let newAnswers = [...answers];
                                newAnswers[currentQuestion] = i;
                                setAnswers(newAnswers);
                            }} />
                            <label className="ml-2">{x.answer}</label>
                        </div>)}
                    </div>
                </div>
                <div className="w-full sm:w-1/4 border border-black px-2 py-1 bg-white">
                    <p>Questions</p>
                    <div className="grid grid-cols-10 sm:grid-cols-5 gap-1">
                        {questions.map((x, i) => <div key={i} className={`border border-black flex items-center justify-center rounded ${currentQuestion == i ? 'bg-cyan-500 text-white' : (answers[i] != undefined ? 'bg-green-500 text-white' : '')}`} onClick={() => setCurrentQuestion(i)}>{i+1}</div>)}
                    </div>
                </div>
            </div>
            <div className="w-full text-right mt-3">
                <button onClick={handleSubmit} className="bg-gradient-to-b from-[#02C166] to-[#0068FF] px-3 py-2 rounded text-white">Submit</button>
            </div>
        </div>
    );
}