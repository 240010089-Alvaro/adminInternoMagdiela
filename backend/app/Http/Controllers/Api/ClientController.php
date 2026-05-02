<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    public function index(Request $request)
    {
        $query = Client::query();

        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('phone', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->has('with_debt') && $request->with_debt) {
            $query->where('total_debt', '>', 0);
        }

        $clients = $query->orderBy('name')->paginate(20);

        return response()->json($clients);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $client = Client::create($request->only(['name', 'phone', 'email', 'address', 'notes']));

        return response()->json($client, 201);
    }

    public function show(Client $client)
    {
        $client->load([
            'sales' => function ($q) {
                $q->with('items.product')->orderBy('created_at', 'desc')->limit(20);
            },
            'credits' => function ($q) {
                $q->with('payments')->orderBy('created_at', 'desc');
            }
        ]);

        return response()->json($client);
    }

    public function update(Request $request, Client $client)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $client->update($request->only(['name', 'phone', 'email', 'address', 'notes']));

        return response()->json($client);
    }

    public function destroy(Client $client)
    {
        $client->delete();
        return response()->json(['message' => 'Clienta eliminada']);
    }

    public function all()
    {
        // Devolver todas las clientas sin paginación (para selects)
        $clients = Client::select('id', 'name', 'phone', 'total_debt')
            ->orderBy('name')
            ->get();

        return response()->json($clients);
    }
}
