import { Head, Link, useForm } from "@inertiajs/react";
import Layout from "@/Layouts/Layout";
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import copy from "copy-to-clipboard";

export default function Edit({ auth, exam }) {
    const form = useForm({
        title: exam.title,
        description: exam.description || "",
        duration: exam.duration,
        questions: exam.questions,
        status: exam.status,
    });
    const [activeTab, setActiveTab] = useState(1);
    const [currentQuestion, setCurrentQuestion] = useState(0);

    const handleAddQuestion = () => {
        form.setData("questions", [
            ...form.data.questions,
            {
                question: "",
                correct: 0,
                answers: [{
                    "answer": ""
                }],
            },
        ]);
        setCurrentQuestion(
            form.data.questions.length
        );
        setActiveTab(0);
    }

    const handleRemoveQuestion = () => {
        form.data.questions.splice(currentQuestion, 1);
        form.setData("questions", form.data.questions);
        if (currentQuestion == form.data.questions.length) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const hanldeAddOption = () => {
        form.data.questions[currentQuestion].answers.push({
            "answer": ""
        });
        if (form.data.questions[currentQuestion].correct < 0) {
            form.data.questions[currentQuestion].correct = 0;
        }
        form.setData("questions", form.data.questions);
    };

    const handleRemoveOption = (index) => {
        form.data.questions[currentQuestion].answers.splice(index, 1);
        if (
            form.data.questions[currentQuestion].correct >=
            form.data.questions[currentQuestion].answers.length
        ) {
            form.data.questions[currentQuestion].correct =
                form.data.questions[currentQuestion].answers.length - 1;
        }
        if (form.data.questions[currentQuestion].correct < 0) {
            form.data.questions[currentQuestion].correct = 0;
        }
        form.setData("questions", form.data.questions);
    };

    const handleSave = () => {
        form.patch(route("profile.exams.update", exam));
    };

    const handleDelete = () => {
        form.delete(route("profile.exams.destroy", exam));
    };

    const handleCopyCode = () => {
        if (copy(exam.short_id)) 
            toast("Copied code to clipboard", { type: "success", autoClose: 2000, position: "bottom-right" });
        else
            toast("Failed to copy code", { type: "error", autoClose: 2000, position: "bottom-right" });
    }

    useEffect(() => {
        form.clearErrors();
    }, [form.data])

    return (
        <Layout>
            <Head title={`Edit ${form.data.title}`} />
            <div className="mt-10 mx-[10%] flex items-start max-sm:flex-col select-none pb-10">
                <div className="w-full sm:w-3/4 border border-black rounded-t-lg">
                    <div className="grid grid-cols-2 divide-x divide-black bg-gray-300 rounded-t-lg">
                        <div
                            className={`text-center cursor-pointer py-0.5 ${
                                activeTab == 0 ? "underline" : ""
                            }`}
                            onClick={() => setActiveTab(0)}
                        >
                            Questions
                        </div>
                        <div
                            className={`text-center cursor-pointer py-0.5 ${
                                activeTab == 1 ? "underline" : ""
                            }`}
                            onClick={() => setActiveTab(1)}
                        >
                            Config
                        </div>
                    </div>
                    <div className="min-h-[100px] bg-white border-t border-black">
                        {form.data.questions[currentQuestion] &&
                            activeTab == 0 && (
                                <div className="p-2">
                                    <div className="flex flex-col">
                                        <textarea
                                            className="w-full rounded-xl"
                                            type="text"
                                            value={
                                                form.data.questions[
                                                    currentQuestion
                                                ].question
                                            }
                                            onChange={(e) => {
                                                form.data.questions[
                                                    currentQuestion
                                                ].question = e.target.value;
                                                form.setData(
                                                    "questions",
                                                    form.data.questions
                                                );
                                            }}
                                            placeholder="Question"
                                        />
                                        <small className="text-sm text-red-500">
                                            {
                                                form.errors[
                                                    `questions.${currentQuestion}.question`
                                                ]
                                            }
                                        </small>
                                        <small className="text-sm text-red-500">
                                            {
                                                form.errors[
                                                    `questions.${currentQuestion}.answers`
                                                ]
                                            }
                                        </small>
                                    </div>
                                    <div className="mt-2 flex flex-col gap-2">
                                        {form.data.questions[
                                            currentQuestion
                                        ].answers.map((answer, index) => (
                                            <div key={index}>
                                                <div className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        checked={
                                                            form.data.questions[
                                                                currentQuestion
                                                            ].correct == index
                                                        }
                                                        onChange={(e) => {
                                                            form.data.questions[
                                                                currentQuestion
                                                            ].correct = index;
                                                            form.setData(
                                                                "questions",
                                                                form.data
                                                                    .questions
                                                            );
                                                        }}
                                                    />
                                                    <input
                                                        className="mx-2 w-full rounded-xl"
                                                        type="text"
                                                        value={answer.answer}
                                                        onChange={(e) => {
                                                            form.data.questions[
                                                                currentQuestion
                                                            ].answers[
                                                                index
                                                            ].answer =
                                                                e.target.value;
                                                            form.setData(
                                                                "questions",
                                                                form.data
                                                                    .questions
                                                            );
                                                        }}
                                                        placeholder="Option"
                                                    />
                                                    <button
                                                        className="px-2 py-1"
                                                        onClick={() =>
                                                            handleRemoveOption(
                                                                index
                                                            )
                                                        }
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="w-6 h-6"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                fill="currentColor"
                                                                d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12l1.41 1.41L13.41 14l2.12 2.12l-1.41 1.41L12 15.41l-2.12 2.12l-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"
                                                            ></path>
                                                        </svg>
                                                    </button>
                                                </div>
                                                <small className="text-sm text-red-500 w-full">
                                                    {
                                                        form.errors[
                                                            `questions.${currentQuestion}.answers.${index}.answer`
                                                        ]
                                                    }
                                                </small>
                                            </div>
                                        ))}
                                        <div>
                                            <button className="border border-black rounded-lg px-2 py-1" onClick={hanldeAddOption}>
                                                Add choice
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        {activeTab == 1 && (
                            <div className="p-2">
                                <div>
                                    <label>Title</label>
                                    <input
                                        className="w-full rounded-xl"
                                        type="text"
                                        value={form.data.title}
                                        onChange={(e) =>
                                            form.setData(
                                                "title",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Title"
                                    />
                                    <small className="text-sm text-red-500">{form.errors.title}</small>
                                </div>
                                <div className="mt-2">
                                    <label>Description</label>
                                    <textarea
                                        className="w-full rounded-xl"
                                        type="text"
                                        value={form.data.description}
                                        onChange={(e) =>
                                            form.setData(
                                                "description",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Description"
                                    />
                                    <small className="text-sm text-red-500">{form.errors.description}</small>
                                </div>
                                <div className="mt-2">
                                    <label>Duration (second)</label>
                                    <input
                                        className="w-full rounded-xl"
                                        type="number"
                                        value={form.data.duration}
                                        onChange={(e) =>
                                            form.setData(
                                                "duration",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Duration"
                                    />
                                    <small className="text-sm text-red-500">{form.errors.duration}</small>
                                </div>
                                <div className="mt-2">
                                    <label>Status</label>
                                    <select
                                        className="w-full rounded-xl"
                                        onChange={(e) =>
                                            form.setData(
                                                "status",
                                                e.target.value
                                            )
                                        }
                                        value={form.data.status}
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="publish">Publish</option>
                                    </select>
                                    <small className="text-sm text-red-500">{form.errors.status}</small>
                                </div>
                                {exam.short_id && (
                                    <div 
                                        className="mt-2" 
                                        title="Copy Code"
                                        onClick={handleCopyCode}
                                    >
                                        <label>Code</label>
                                        <input
                                            className="w-full rounded-xl"
                                            type="text"
                                            value={exam.short_id}
                                            readOnly
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="flex items-center justify-between border-t border-black bg-gray-300">
                        <div>
                            <Link href={route('profile.exams.index')}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8l8 8l1.41-1.41L7.83 13H20v-2z"></path></svg>
                            </Link>
                        </div>
                        <div className="flex items-center justify-end divide-x divide-black">
                            <div
                                className="cursor-pointer"
                                title="Save"
                                onClick={handleSave}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-8 h-8"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        fill="currentColor"
                                        d="M17 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3s3 1.34 3 3s-1.34 3-3 3zm3-10H5V5h10v4z"
                                    ></path>
                                </svg>
                            </div>
                            {form.data.questions[currentQuestion] && activeTab == 0 && <div
                                className="cursor-pointer"
                                onClick={handleRemoveQuestion}
                                title="Remove Question"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-8 h-8"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        fill="currentColor"
                                        d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12l1.41 1.41L13.41 14l2.12 2.12l-1.41 1.41L12 15.41l-2.12 2.12l-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"
                                    ></path>
                                </svg>
                            </div>}
                            {activeTab == 1 && <div
                                className="cursor-pointer"
                                title="Delete"
                                onClick={handleDelete}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-8 h-8"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        fill="currentColor"
                                        d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12l1.41 1.41L13.41 14l2.12 2.12l-1.41 1.41L12 15.41l-2.12 2.12l-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"
                                    ></path>
                                </svg>
                            </div>}
                        </div>
                    </div>
                </div>
                <div className="w-full max-sm:mt-3 sm:w-1/4 sm:px-2">
                    <div className="border border-black bg-white p-2 rounded-lg">
                        <p>List questions</p>
                        <hr className="border-black mt-1 mb-3" />
                        <small className="text-sm text-red-500">{form.errors.questions}</small>
                        <div className="grid grid-cols-10 sm:grid-cols-5 gap-1">
                            {form.data.questions.map((question, index) => (
                                <div
                                    key={index}
                                    onClick={() => setCurrentQuestion(index)}
                                    className={`border border-black rounded-xl flex items-center justify-center py-1 px-3 h-10 cursor-pointer ${
                                        currentQuestion == index
                                            ? "bg-cyan-500 text-white"
                                            : (false ? "bg-red-500 text-white" : "")
                                    }`}
                                >
                                    <span>{index + 1}</span>
                                </div>
                            ))}
                            <div
                                className="border border-black rounded-xl flex items-center justify-center py-1 px-1 cursor-pointer h-10"
                                onClick={handleAddQuestion}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-8 h-8"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        fill="currentColor"
                                        d="M19 12.998h-6v6h-2v-6H5v-2h6v-6h2v6h6z"
                                    ></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
