<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Credit;
use App\Models\CreditPayment;
use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CreditController extends Controller
{
    public function index(Request $request)
    {
        $query = Credit::with(['client', 'sale']);
        if ($request->status) $query->where('status', $request->status);
        if ($request->client_id) $query->where('client_id', $request->client_id);
        return response()->json($query->orderBy('created_at', 'desc')->paginate(20));
    }

    public function show(Credit $credit)
    {
        return response()->json($credit->load(['client', 'sale.items.product', 'payments']));
    }

    public function addPayment(Request $request, Credit $credit)
    {
        $request->validate([
            'amount' => 'required|numeric|min:0.01|max:' . $credit->balance,
            'payment_method' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            CreditPayment::create([
                'credit_id' => $credit->id,
                'amount' => $request->amount,
                'payment_method' => $request->payment_method ?? 'efectivo',
                'notes' => $request->notes,
            ]);

            $credit->paid_amount += $request->amount;
            $credit->balance -= $request->amount;
            if ($credit->balance <= 0) {
                $credit->balance = 0;
                $credit->status = 'liquidado';
                if ($credit->sale_id) {
                    \App\Models\Sale::where('id', $credit->sale_id)->update(['status' => 'completada']);
                }
            }
            $credit->save();

            $client = Client::find($credit->client_id);
            if ($client) {
                $client->total_debt = max(0, $client->total_debt - $request->amount);
                $client->save();
            }

            DB::commit();
            return response()->json($credit->load('payments'));
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);
        }
    }
}
