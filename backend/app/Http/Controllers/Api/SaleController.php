<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use App\Models\Credit;
use App\Models\Client;
use App\Models\History;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SaleController extends Controller
{
    public function index(Request $request)
    {
        $query = Sale::with(['client', 'user']);
        if ($request->date_from) $query->whereDate('created_at', '>=', $request->date_from);
        if ($request->date_to) $query->whereDate('created_at', '<=', $request->date_to);
        if ($request->payment_method) $query->where('payment_method', $request->payment_method);
        if ($request->status) $query->where('status', $request->status);
        return response()->json($query->orderBy('created_at', 'desc')->paginate(20));
    }

    public function store(Request $request)
    {
        $request->validate([
            'client_id' => 'nullable|exists:clients,id',
            'customer_name' => 'nullable|string|max:255',
            'payment_method' => 'required|in:efectivo,credito',
            'items' => 'nullable|string',
            'total' => 'required|numeric|min:0.01',
            'notes' => 'nullable|string',
            'due_date' => 'nullable|date',
        ]);

        DB::beginTransaction();
        try {
            $total = $request->total;
            $clientId = $request->client_id;

            // Si es crédito y no tenemos un ID de clienta pero sí un nombre manual, la registramos automáticamente
            if ($request->payment_method === 'credito' && !$clientId && $request->customer_name) {
                $newClient = Client::create([
                    'name' => $request->customer_name,
                    'phone' => 'N/A'
                ]);
                $clientId = $newClient->id;
            }

            $sale = Sale::create([
                'client_id' => $clientId, 
                'customer_name' => !$clientId ? $request->customer_name : null,
                'user_id' => $request->user()->id,
                'payment_method' => $request->payment_method, 
                'items' => $request->items,
                'subtotal' => $total,
                'discount' => 0, 
                'total' => $total,
                'status' => $request->payment_method === 'credito' ? 'pendiente' : 'completada', 
                'notes' => $request->notes,
            ]);

            if ($request->payment_method === 'credito' && $clientId) {
                Credit::create([
                    'client_id' => $clientId, 
                    'sale_id' => $sale->id, 
                    'total_amount' => $total, 
                    'paid_amount' => 0, 
                    'balance' => $total, 
                    'status' => 'pendiente', 
                    'due_date' => $request->due_date
                ]);
                $client = Client::find($clientId);
                $client->increment('total_debt', $total);
                $client->increment('total_purchases', $total);
            } elseif ($clientId) {
                Client::find($clientId)->increment('total_purchases', $total);
            }

            DB::commit();

            History::create([
                'type' => 'venta',
                'description' => "Venta registrada" . ($sale->client ? " a " . $sale->client->name : ($sale->customer_name ? " a " . $sale->customer_name : "")),
                'amount' => $sale->total,
                'user_id' => $request->user()->id,
                'reference_type' => 'Sale',
                'reference_id' => $sale->id
            ]);

            return response()->json($sale->load(['client']), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    public function show(Sale $sale)
    {
        return response()->json($sale->load(['client', 'user', 'credit.payments']));
    }

    public function cancel(Sale $sale)
    {
        if ($sale->status === 'cancelada') return response()->json(['message' => 'Ya cancelada'], 422);
        DB::beginTransaction();
        try {
            if ($sale->credit) {
                if ($sale->client) { 
                    $sale->client->decrement('total_debt', $sale->credit->balance); 
                    $sale->client->decrement('total_purchases', $sale->total); 
                }
                $sale->credit->update(['status' => 'liquidado', 'balance' => 0]);
            } elseif ($sale->client) { 
                $sale->client->decrement('total_purchases', $sale->total); 
            }
            $sale->update(['status' => 'cancelada']);

            History::create([
                'type' => 'cambio',
                'description' => "Venta #{$sale->id} cancelada",
                'amount' => $sale->total,
                'user_id' => request()->user()->id,
                'reference_type' => 'Sale',
                'reference_id' => $sale->id
            ]);

            DB::commit();
            return response()->json(['message' => 'Registro cancelado']);
        } catch (\Exception $e) { 
            DB::rollBack(); 
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500); 
        }
    }
}
