<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\History;
use Illuminate\Http\Request;

class HistoryController extends Controller
{
    public function index(Request $request)
    {
        $query = History::with(['user']);
        if ($request->type) $query->where('type', $request->type);
        
        return response()->json($query->orderBy('created_at', 'desc')->paginate(50));
    }

    public function destroy(History $history)
    {
        $history->delete();
        return response()->json(['message' => 'Entrada eliminada del historial']);
    }

    public function clear()
    {
        History::truncate();
        return response()->json(['message' => 'Historial vaciado correctamente']);
    }
}
