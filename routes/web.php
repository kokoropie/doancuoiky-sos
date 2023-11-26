<?php

use App\Http\Controllers\ExamController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProfileDashboardController;
use App\Http\Controllers\ProfileExamController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return redirect(route("home"));
    // return Inertia::render('Welcome', [
    //     'canLogin' => Route::has('login'),
    //     'canRegister' => Route::has('register'),
    //     'laravelVersion' => Application::VERSION,
    //     'phpVersion' => PHP_VERSION,
    // ]);
});

Route::get('/home', function () {
    return Inertia::render('Home');
})->name('home');

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::resource('/profile/exams', ProfileExamController::class)->names([
        'index' => 'profile.exams.index',
        'show' => 'profile.exams.show',
        'create' => 'profile.exams.create',
        'store' => 'profile.exams.store',
        'edit' => 'profile.exams.edit',
        'update' => 'profile.exams.update',
        'destroy' => 'profile.exams.destroy',
    ]);
    Route::get('/profile/dashboard', [ProfileDashboardController::class, 'index'])->name('profile.dashboard.index');
});

Route::get('/exam/{short}/short', [ExamController::class, 'short'])->name('exam.short')->where('short', '[A-Za-z0-9]{10}');
Route::get('/exam/{exam}', [ExamController::class, 'show'])->name('exam.show');
Route::get('/exam/{exam}/join', [ExamController::class, 'join'])->name('exam.join');
Route::post('/exam/{exam}', [ExamController::class, 'submit'])->name('exam.submit');
Route::get('/result', [ExamController::class, 'result'])->name('exam.result');

require __DIR__.'/auth.php';
