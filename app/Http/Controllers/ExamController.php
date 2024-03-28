<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ExamController extends Controller
{
    /**
     * Display the specified resource.
     */
    public function show(Request $request, Exam $exam)
    {
        if ($request->user()) {
            $user = $request->user();
            if ($user->results()->where("exam_id", $exam->exam_id)->exists()) {
                $result = $user->results()->where("exam_id", $exam->exam_id)->first();
                return redirect()->route('exam.result')->with('result', [
                    "count_correct" => $result->count_correct,
                    "count_questions" => $result->count_questions,
                    "result" => round($result->count_correct / $result->count_questions * 10, 1)
                ]);
            }
        }
        return Inertia::render('Exam/Show', [
            "exam" => collect($exam)->put("questions_count", count($exam->questions))
        ]);
    }

    public function short(string $short)
    {
        $short = Str::upper($short);
        if (Exam::where("short_id", $short)->exists()) {
            $exam = Exam::where("short_id", $short)->first();
            return redirect()->route('exam.show', $exam->exam_id);
        } else {
            return redirect()->route('home')->with('toast', [
                'message' => 'Exam not found.',
                'config' => [
                    'type' => 'error',
                    'position' => 'bottom-right',
                    'autoClose' => 2000
                ]
            ]);
        }
    }

    public function join(Request $request, Exam $exam)
    {
        if ($request->user()) {
            $user = $request->user();
            if ($user->results()->where("exam_id", $exam->exam_id)->exists()) {
                $result = $user->results()->where("exam_id", $exam->exam_id)->first();
                return redirect()->route('exam.result')->with('result', [
                    "count_correct" => $result->count_correct,
                    "count_questions" => $result->count_questions,
                    "result" => round($result->count_correct / $result->count_questions * 10, 1)
                ]);
            }
        }
        if (!session()->has('exam')) {
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

            $data->put('questions', $questions);
            $data->put('answers', $answers);

            session()->put('exam', $data);
        }

        $ss_exam = session()->get('exam');

        if ($ss_exam->get("exam")->exam_id != $exam->exam_id) {
            return redirect()->route('home')->with('toast', [
                'message' => 'You can only join one exam once.',
                'config' => [
                    'type' => 'error',
                    'position' => 'bottom-right',
                    'autoClose' => 2000
                ]
            ]);
        }

        return Inertia::render('Exam/Join', [
            "exam" => $ss_exam->get("exam"),
            "time_end" => $ss_exam->get("time_end"),
            "questions" => $ss_exam->get("questions"),
            "time_left" => $ss_exam->get("time_end")->diffInSeconds(now())
        ]);
    }
    
    public function submit(Request $request, Exam $exam)
    {
        if ($request->user()) {
            $user = $request->user();
            if ($user->results()->where("exam_id", $exam->exam_id)->exists()) {
                $result = $user->results()->where("exam_id", $exam->exam_id)->first();
                return redirect()->route('exam.result')->with('result', [
                    "count_correct" => $result->count_correct,
                    "count_questions" => $result->count_questions,
                    "result" => round($result->count_correct / $result->count_questions * 10, 1)
                ]);
            }
        }
        if (session()->has('exam')) {
            $ss_exam = session()->get('exam');
            if ($ss_exam->get("exam")->exam_id == $exam->exam_id) {
                session()->forget('exam');
                $correct_answers = collect($ss_exam->get("answers"));
                $answers = collect($request->input('answers'));
                $count_correct = 0;
                foreach ($answers as $key => $answer) {
                    if ($correct_answers->get($key) == $answer) {
                        $count_correct++;
                    }
                }
                $result = round($count_correct / $correct_answers->count() * 10, 1);

                if ($request->user()) {
                    $request->user()->results()->create([
                        "exam_id" => $exam->exam_id,
                        "count_correct" => $count_correct,
                        "count_questions" => $correct_answers->count()
                    ]);
                }
                
                return redirect()->route('exam.result')->with('result', [
                    "count_correct" => $count_correct,
                    "count_questions" => $correct_answers->count(),
                    "result" => $result
                ]);
            } else {
                return redirect()->route('home')->with('toast', [
                    'message' => 'You can only submit answers to the exam you joined.',
                    'config' => [
                        'type' => 'error',
                        'position' => 'bottom-right',
                        'autoClose' => 2000
                    ]
                ]);
            }
        } else {
            return redirect()->route('home')->with('toast', [
                'message' => 'You don\'t have any exam to submit.',
                'config' => [
                    'type' => 'error',
                    'position' => 'bottom-right',
                    'autoClose' => 2000
                ]
            ]);
        }
    }

    public function result (Request $request)
    {
        if (session()->has('result'))
            return Inertia::render('Exam/Result');
        else 
            return redirect()->route('home')->with('toast', [
                'message' => 'You don\'t have any result.',
                'config' => [
                    'type' => 'error',
                    'position' => 'bottom-right',
                    'autoClose' => 2000
                ]
            ]);
    }
}
