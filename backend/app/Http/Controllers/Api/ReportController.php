<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use App\Models\Credit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

use PDF;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $data = $this->getReportData($request);
        return response()->json($data);
    }

    public function exportPdf(Request $request)
    {
        $data = $this->getReportData($request);
        
        $pdf = PDF::loadView('reports.pdf', [
            'from' => $data['period']['from'],
            'to' => $data['period']['to'],
            'total_revenue' => $data['total_revenue'],
            'total_cost' => $data['total_cost'],
            'profit' => $data['profit'],
            'total_sales' => $data['total_sales'],
            'sales_by_category' => $data['sales_by_category'],
            'sales_by_payment' => $data['sales_by_payment'],
            'active_debts' => $data['active_debts'],
            'total_debt' => $data['total_debt'],
        ]);

        return $pdf->download('reporte_magdiela.pdf');
    }

    private function getReportData(Request $request)
    {
        $request->validate([
            'period' => 'nullable|in:day,week,month,custom',
            'date_from' => 'nullable|date',
            'date_to' => 'nullable|date',
        ]);

        $period = $request->period ?? 'month';
        $now = Carbon::now();

        switch ($period) {
            case 'day':
                $from = $now->copy()->startOfDay();
                $to = $now->copy()->endOfDay();
                break;
            case 'week':
                $from = $now->copy()->startOfWeek();
                $to = $now->copy()->endOfWeek();
                break;
            case 'custom':
                $from = Carbon::parse($request->date_from)->startOfDay();
                $to = Carbon::parse($request->date_to)->endOfDay();
                break;
            default:
                $from = $now->copy()->startOfMonth();
                $to = $now->copy()->endOfMonth();
        }

        $sales = Sale::whereBetween('created_at', [$from, $to])->where('status', '!=', 'cancelada');
        $totalRevenue = (float) $sales->sum('total');
        $totalSales = $sales->count();

        // Si el sistema simplificado no usa SaleItems con productos, esto podría ser 0.
        // Pero mantendremos la lógica por si acaso.
        $totalCost = (float) DB::table('sale_items')
            ->join('sales', 'sales.id', '=', 'sale_id')
            ->join('products', 'products.id', '=', 'product_id')
            ->whereBetween('sales.created_at', [$from, $to])
            ->where('sales.status', '!=', 'cancelada')
            ->sum(DB::raw('sale_items.quantity * products.cost'));

        $profit = $totalRevenue - $totalCost;

        $salesByCategory = DB::table('sale_items')
            ->join('products', 'products.id', '=', 'product_id')
            ->join('categories', 'categories.id', '=', 'category_id')
            ->join('sales', 'sales.id', '=', 'sale_id')
            ->whereBetween('sales.created_at', [$from, $to])
            ->where('sales.status', '!=', 'cancelada')
            ->select('categories.name', DB::raw('SUM(sale_items.subtotal) as total'), DB::raw('SUM(sale_items.quantity) as qty'))
            ->groupBy('categories.name')
            ->orderByDesc('total')
            ->get();

        $salesByPayment = Sale::whereBetween('created_at', [$from, $to])
            ->where('status', '!=', 'cancelada')
            ->select('payment_method', DB::raw('COUNT(*) as count'), DB::raw('SUM(total) as total'))
            ->groupBy('payment_method')
            ->get();

        $activeDebts = Credit::where('status', 'pendiente')
            ->with('client:id,name')
            ->select('id', 'client_id', 'total_amount', 'paid_amount', 'balance', 'due_date', 'created_at')
            ->orderByDesc('balance')
            ->get();

        $totalDebt = (float) Credit::where('status', 'pendiente')->sum('balance');

        return [
            'period' => ['from' => $from->toDateString(), 'to' => $to->toDateString()],
            'total_revenue' => $totalRevenue,
            'total_cost' => $totalCost,
            'profit' => $profit,
            'total_sales' => $totalSales,
            'sales_by_category' => $salesByCategory,
            'sales_by_payment' => $salesByPayment,
            'active_debts' => $activeDebts,
            'total_debt' => $totalDebt,
        ];
    }
}
