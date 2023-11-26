<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class ProfileExamController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return Inertia::render('Profile/Exams/Index', [
            "exams" => $request->user()->exams()->orderBy("updated_at", "desc")->get()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $exam = new Exam();
        $exam->title = "Untitled";
        $exam->questions = [];
        $request->user()->exams()->save($exam);
        return redirect()->route('profile.exams.edit', $exam->exam_id)->with('toast', [
            'message' => 'Exam created.',
            'config' => [
                'type' => 'success', 
                'position' => 'bottom-right', 
                'autoClose' => 2000
            ]
        ]);;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Exam $exam)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Exam $exam)
    {
        $exam->makeVisible(["questions"]);
        return Inertia::render('Profile/Exams/Edit', [
            "exam" => $exam
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Exam $exam)
    {
        // dd($request->all(), $exam);
        $validated = $request->validate([
            "title" => "required|string|max:255",
            "description" => "nullable|string|max:255",
            "duration" => "required|integer|min:60",
            "status" => "required|in:draft,publish",
            "questions" => "required|array",
            "questions.*.question" => "required|string|max:255",
            "questions.*.correct" => ["required","integer", function (string $attribute, mixed $value, \Closure $fail) use ($request) {
                $other = explode(".", $attribute);
                array_pop($other);
                $other[] = "answers";
                $other = implode(".", $other);
                $max = count($request->input($other)) - 1;
                if ($value < 0 || $value > $max) {
                    $fail("Must choose the correct answer.");
                }
            }],
            "questions.*.answers" => "required|array|min:2",
            "questions.*.answers.*.answer" => "required|string|max:255",
        ], [
            "questions.*.question" => [
                "required" => "The question field is required.",
                "string" => "The question field must be a string.",
                "max" => "The question field must not be greater than :max characters."
            ],
            "questions.*.correct" => [
                "required" => "The correct field is required.",
                "integer" => "The correct field must be an integer."
            ],
            "questions.*.answers" => [
                "required" => "The answers field is required.",
                "array" => "The answers field must be an array.",
                "min" => "The answers field must have at least :min items."
            ],
            "questions.*.answers.*.answer" => [
                "required" => "The answer field is required.",
                "string" => "The answer field must be a string.",
                "max" => "The answer field must not be greater than :max characters."
            ]
        ]);
        $exam->fill($validated);
        if ($exam->isDirty("status")) {
            if ($exam->status === "publish") {
                $exam->short_id = Str::upper(Str::random(10));
            } else {
                $exam->short_id = null;
            }
        }
        $exam->save();
        return redirect()->route('profile.exams.edit', $exam->exam_id)->with('toast', [
            'message' => 'Exam updated.', 
            'config' => [
                'type' => 'success', 
                'position' => 'bottom-right', 
                'autoClose' => 2000
            ]
        ]);;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Exam $exam)
    {
        $exam->delete();
        return redirect()->route('profile.exams.index')->with('toast', [
            'message' => 'Exam deleted.', 
            'config' => [
                'type' => 'success', 
                'position' => 'bottom-right', 
                'autoClose' => 2000
            ]
        ]);;
    }
}
