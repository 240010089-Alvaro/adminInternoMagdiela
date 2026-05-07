<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\SaleController;
use App\Http\Controllers\Api\CreditController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\HistoryController;

// Auth routes
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Categories
    Route::apiResource('categories', CategoryController::class);

    // Products
    Route::apiResource('products', ProductController::class);
    Route::post('/products/{product}/adjust-stock', [ProductController::class, 'adjustStock']);

    // Clients
    Route::get('/clients/all', [ClientController::class, 'all']);
    Route::apiResource('clients', ClientController::class);

    // Sales
    Route::apiResource('sales', SaleController::class)->only(['index', 'store', 'show']);
    Route::post('/sales/{sale}/cancel', [SaleController::class, 'cancel']);

    // Credits
    Route::get('/credits', [CreditController::class, 'index']);
    Route::get('/credits/{credit}', [CreditController::class, 'show']);
    Route::post('/credits/{credit}/payment', [CreditController::class, 'addPayment']);

    // Reports
    Route::get('/reports', [ReportController::class, 'index']);
    Route::get('/reports/export-pdf', [ReportController::class, 'exportPdf']);

    // History
    Route::get('/history', [HistoryController::class, 'index']);
    Route::delete('/history/{history}', [HistoryController::class, 'destroy']);
    Route::post('/history/clear', [HistoryController::class, 'clear']);
});
