<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ExamController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(request()->user('sanctum')->exams);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $exam = new Exam();
        $exam->title = "Untitled";
        $exam->questions = [];
        $request->user('sanctum')->exams()->save($exam);

        return response()->json($exam);
    }

    /**
     * Display the specified resource.
     */
    public function show(Exam $exam)
    {
        $exam->makeVisible(["questions"]);
        return response()->json($exam);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Exam $exam)
    {
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

        $exam->makeVisible(["questions"]);
        return response()->json($exam);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Exam $exam)
    {
        $exam->delete();
        return response()->json([
            'message' => 'Exam deleted.'
        ]);
    }

    public function short(string $short)
    {
        $exam = Exam::where("short_id", str($short)->upper())->firstOrFail();
        if (request()->user('sanctum')) {
            $user = request()->user('sanctum');
            if ($user->results()->where("exam_id", $exam->exam_id)->exists()) {
                $result = $user->results()->where("exam_id", $exam->exam_id)->first();
                return response()->json([
                    "count_correct" => $result->count_correct,
                    "count_questions" => $result->count_questions,
                    "result" => round($result->count_correct / $result->count_questions * 10, 1)
                ]);
            }
        }
        return response()->json($exam);
    }

    public function join(Exam $exam)
    {
        if (request()->user('sanctum')) {
            $user = request()->user('sanctum');
            if ($user->results()->where("exam_id", $exam->exam_id)->exists()) {
                $result = $user->results()->where("exam_id", $exam->exam_id)->first();
                return response()->json([
                    "count_correct" => $result->count_correct,
                    "count_questions" => $result->count_questions,
                    "result" => round($result->count_correct / $result->count_questions * 10, 1)
                ]);
            }
        }
        if (request()->user('sanctum')) {
            $id = request()->user('sanctum')->user_id;
        } else {
            $id = request()->ip();
        }
        $keyQuestions = "{$id}:exam:questions";
        $keyAnswers = "{$id}:exam:answers";
        $keyData = "{$id}:exam:data";

        if (!cache()->has($keyData)) {
            $data = collect();
            $data->put('exam', $exam);
            $data->put('time_end', now()->addSeconds($exam->duration));
    
            $questions = collect($exam->questions)->shuffle()->map(function ($question) {
                $question['answers'][$question['correct']]['correct'] = true;
                unset($question['correct']);
                return collect($question)->put('answers', collect($question['answers'])->shuffle());
            });
    
            $answers = collect([]);
            foreach ($questions as $question) {
                foreach ($question->get('answers') as $key => $answer) {
                    if (isset($answer['correct'])) {
                        $answers->push($key);
                        unset($answer['correct']);
                        $question->put('answers', $question->get('answers')->put($key, $answer));
                        break;
                    }
                }
            }
    
            cache()->rememberForever($keyQuestions, function () use ($questions) {
                return $questions;
            });

            cache()->rememberForever($keyAnswers, function () use ($answers) {
                return $answers;
            });

            cache()->rememberForever($keyData, function () use ($data) {
                return $data;
            });
        }

        $c_exam = cache()->get($keyData);
        
        if ($c_exam->get('exam')->exam_id != $exam->exam_id) {
            return response()->json([
                'message' => 'You can only join one exam once.'
            ]);
        }

        return response()->json([
            "exam" => $c_exam->get("exam"),
            "time_end" => $c_exam->get("time_end"),
            "questions" => cache()->get($keyQuestions),
            "time_left" => $c_exam->get("time_end")->diffInSeconds(now())
        ]);
    }

    public function submit(Exam $exam) {
        if (request()->user('sanctum')) {
            $user = request()->user('sanctum');
            if ($user->results()->where("exam_id", $exam->exam_id)->exists()) {
                $result = $user->results()->where("exam_id", $exam->exam_id)->first();
                return response()->json([
                    "count_correct" => $result->count_correct,
                    "count_questions" => $result->count_questions,
                    "result" => round($result->count_correct / $result->count_questions * 10, 1)
                ]);
            }
        }
        if (request()->user('sanctum')) {
            $id = request()->user('sanctum')->user_id;
        } else {
            $id = request()->ip();
        }
        $keyQuestions = "{$id}:exam:questions";
        $keyAnswers = "{$id}:exam:answers";
        $keyData = "{$id}:exam:data";

        if (cache()->has($keyData)) {
            $correct_answers = cache()->get($keyAnswers);
            $c_exam = cache()->get($keyData);

            if ($c_exam->get('exam')->exam_id != $exam->exam_id) {
                return response()->json([
                    'message' => 'You can only join one exam once.'
                ]);
            }

            cache()->forget($keyQuestions);
            cache()->forget($keyAnswers);
            cache()->forget($keyData);

            $answers = collect(request()->input('answers'));
            $count_correct = 0;
            foreach ($answers as $key => $answer) {
                if ($correct_answers->get($key) == $answer) {
                    $count_correct++;
                }
            }
            $result = round($count_correct / $correct_answers->count() * 10, 1);

            if (request()->user('sanctum')) {
                request()->user('sanctum')->results()->create([
                    "exam_id" => $exam->exam_id,
                    "count_correct" => $count_correct,
                    "count_questions" => $correct_answers->count()
                ]);
            }
            
            return response()->json([
                "count_correct" => $count_correct,
                "count_questions" => $correct_answers->count(),
                "result" => $result
            ]);
        } else {
            return response()->json([
                'message' => 'You have not joined the exam.'
            ]);
        }
    }

    public function dashboard(Request $request)
    {
        return response()->json([
            "exams_count" => $request->user('sanctum')->exams()->count(),
            "joined_exams_count" => $request->user('sanctum')->results()->count(),
            "results_count" => $request->user('sanctum')->exams->reduce(function ($carry, $exam) {
                return $carry + $exam->results()->count();
            }, 0)
        ]);
    }
}
