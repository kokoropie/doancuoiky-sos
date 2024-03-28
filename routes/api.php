<?php

use App\Http\Controllers\Api\ExamController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('login', [UserController::class, 'login']);
Route::post('register', [UserController::class, 'register']);

Route::middleware('auth:sanctum')->group(function() {
    Route::post('logout', [UserController::class, 'logout']);
    Route::prefix('user')->group(function() {
        Route::get('', [UserController::class, 'index']);
        Route::match(['put', 'patch'], '', [UserController::class, 'update']);
        Route::match(['put', 'patch'], 'password', [UserController::class, 'password']);
        Route::delete('', [UserController::class, 'destroy']);
    });
    Route::get('exams/dashboard', [ExamController::class, 'dashboard']);
    Route::resource('exams', ExamController::class)->except(['create', 'edit'])->whereUuid("exam");
});

Route::get('exam/{short}/short', [ExamController::class, 'short'])->where('short', '[A-Za-z0-9]{10}');
Route::get('exam/{exam}/join', [ExamController::class, 'join']);
Route::post('exam/{exam}', [ExamController::class, 'submit']);