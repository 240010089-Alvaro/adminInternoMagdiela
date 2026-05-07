<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\History;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::withCount('products')->orderBy('name')->get();
        return response()->json($categories);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:categories',
            'description' => 'nullable|string',
        ]);

        $category = Category::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description,
        ]);

        History::create([
            'type' => 'cambio',
            'description' => "Nueva categoría creada: {$category->name}",
            'user_id' => $request->user()->id,
            'reference_type' => 'Category',
            'reference_id' => $category->id
        ]);

        return response()->json($category, 201);
    }

    public function show(Category $category)
    {
        $category->loadCount('products');
        return response()->json($category);
    }

    public function update(Request $request, Category $category)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $category->id,
            'description' => 'nullable|string',
        ]);

        $category->update([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description,
        ]);

        History::create([
            'type' => 'cambio',
            'description' => "Categoría actualizada: {$category->name}",
            'user_id' => $request->user()->id,
            'reference_type' => 'Category',
            'reference_id' => $category->id
        ]);

        return response()->json($category);
    }

    public function destroy(Category $category)
    {
        $category->delete();

        History::create([
            'type' => 'cambio',
            'description' => "Categoría eliminada: {$category->name}",
            'user_id' => request()->user()->id
        ]);

        return response()->json(['message' => 'Categoría eliminada']);
    }
}
