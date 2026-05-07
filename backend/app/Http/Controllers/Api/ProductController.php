<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\InventoryMovement;
use App\Models\History;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with('category');

        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('sku', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->has('category_id') && $request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        $products = $query->orderBy('created_at', 'desc')->paginate(20);

        return response()->json($products);
    }

    public function store(Request $request)
    {
        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'sku' => 'required|string|unique:products',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'cost' => 'nullable|numeric|min:0',
            'sizes' => 'nullable|array',
            'colors' => 'nullable|array',
            'stock' => 'required|integer|min:0',
            'min_stock' => 'nullable|integer|min:0',
            'image' => 'nullable|image|max:2048',
        ]);

        $data = $request->except('image');

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('products', 'public');
        }

        $data['status'] = $request->stock > 0 ? 'disponible' : 'agotado';

        $product = Product::create($data);

        History::create([
            'type' => 'cambio',
            'description' => "Nuevo producto registrado: {$product->name} (SKU: {$product->sku})",
            'user_id' => $request->user()->id,
            'reference_type' => 'Product',
            'reference_id' => $product->id
        ]);

        // Registrar movimiento de inventario inicial
        if ($product->stock > 0) {
            InventoryMovement::create([
                'product_id' => $product->id,
                'type' => 'entrada',
                'quantity' => $product->stock,
                'reason' => 'Stock inicial',
            ]);
        }

        return response()->json($product->load('category'), 201);
    }

    public function show(Product $product)
    {
        $product->load(['category', 'inventoryMovements' => function ($q) {
            $q->orderBy('created_at', 'desc')->limit(20);
        }]);

        return response()->json($product);
    }

    public function update(Request $request, Product $product)
    {
        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'sku' => 'required|string|unique:products,sku,' . $product->id,
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'cost' => 'nullable|numeric|min:0',
            'sizes' => 'nullable|array',
            'colors' => 'nullable|array',
            'stock' => 'required|integer|min:0',
            'min_stock' => 'nullable|integer|min:0',
            'image' => 'nullable|image|max:2048',
        ]);

        $data = $request->except('image');

        if ($request->hasFile('image')) {
            // Eliminar imagen anterior
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $data['image'] = $request->file('image')->store('products', 'public');
        }

        $oldStock = $product->stock;
        $newStock = $request->stock;
        $data['status'] = $newStock > 0 ? 'disponible' : 'agotado';

        $product->update($data);

        History::create([
            'type' => 'cambio',
            'description' => "Producto actualizado: {$product->name}",
            'user_id' => $request->user()->id,
            'reference_type' => 'Product',
            'reference_id' => $product->id
        ]);

        // Registrar movimiento de inventario si cambió el stock
        if ($oldStock != $newStock) {
            $diff = $newStock - $oldStock;
            InventoryMovement::create([
                'product_id' => $product->id,
                'type' => $diff > 0 ? 'entrada' : 'ajuste',
                'quantity' => abs($diff),
                'reason' => 'Ajuste manual de inventario',
            ]);
        }

        return response()->json($product->load('category'));
    }

    public function destroy(Product $product)
    {
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();

        History::create([
            'type' => 'cambio',
            'description' => "Producto eliminado: {$product->name}",
            'user_id' => request()->user()->id
        ]);

        return response()->json(['message' => 'Producto eliminado']);
    }

    public function adjustStock(Request $request, Product $product)
    {
        $request->validate([
            'type' => 'required|in:entrada,salida,ajuste',
            'quantity' => 'required|integer|min:1',
            'reason' => 'nullable|string',
        ]);

        if ($request->type === 'entrada') {
            $product->stock += $request->quantity;
        } elseif ($request->type === 'salida') {
            $product->stock = max(0, $product->stock - $request->quantity);
        } else {
            $product->stock = $request->quantity;
        }

        $product->status = $product->stock > 0 ? 'disponible' : 'agotado';
        $product->save();

        History::create([
            'type' => 'cambio',
            'description' => "Stock ajustado para {$product->name}: {$request->type} de {$request->quantity}",
            'user_id' => $request->user()->id,
            'reference_type' => 'Product',
            'reference_id' => $product->id
        ]);

        InventoryMovement::create([
            'product_id' => $product->id,
            'type' => $request->type,
            'quantity' => $request->quantity,
            'reason' => $request->reason ?? 'Ajuste de inventario',
        ]);

        return response()->json($product);
    }
}
