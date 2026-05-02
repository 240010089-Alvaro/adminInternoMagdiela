<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use App\Models\Client;
use App\Models\Credit;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $today = Carbon::today();
        $startOfMonth = Carbon::now()->startOfMonth();
        $endOfMonth = Carbon::now()->endOfMonth();

        // Ventas del día (Incluye crédito y efectivo, excluye canceladas)
        $todaySales = Sale::whereDate('created_at', $today)
            ->where('status', '!=', 'cancelada')
            ->sum('total');

        $todaySalesCount = Sale::whereDate('created_at', $today)
            ->where('status', '!=', 'cancelada')
            ->count();

        // Ganancias mensuales (Ventas totales del mes)
        $monthlyRevenue = Sale::whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->where('status', '!=', 'cancelada')
            ->sum('total');

        // Clientas con adeudos
        $clientsWithDebtCount = Client::where('total_debt', '>', 0)->count();

        $totalDebt = Credit::where('status', 'pendiente')->sum('balance');

        $debtors = Client::where('total_debt', '>', 0)
            ->orderBy('total_debt', 'desc')
            ->get(['name', 'total_debt', 'id']);

        // Ventas últimos 7 días
        $salesLast7Days = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $total = Sale::whereDate('created_at', $date)
                ->where('status', '!=', 'cancelada')
                ->sum('total');
            $salesLast7Days[] = [
                'date' => $date->format('d/m'),
                'day' => ucfirst($date->locale('es')->isoFormat('ddd D')),
                'total' => (float) $total,
            ];
        }

        // Conteos generales
        $totalClients = Client::count();

        return response()->json([
            'today_sales' => (float) $todaySales,
            'today_sales_count' => $todaySalesCount,
            'monthly_revenue' => (float) $monthlyRevenue,
            'total_debt' => (float) $totalDebt,
            'clients_with_debt_count' => $clientsWithDebtCount,
            'debtors' => $debtors,
            'sales_last_7_days' => $salesLast7Days,
            'total_clients' => $totalClients,
        ]);
    }
}
