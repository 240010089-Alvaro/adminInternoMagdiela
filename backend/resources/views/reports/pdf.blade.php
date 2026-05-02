<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Reporte de Ventas - Magdiela</title>
    <style>
        body { font-family: 'Helvetica', sans-serif; color: #333; line-height: 1.6; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #8B5E83; padding-bottom: 20px; }
        .logo { width: 120px; margin-bottom: 10px; }
        h1 { color: #8B5E83; margin: 0; font-size: 24px; }
        .subtitle { color: #D4A574; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; }
        .info-section { margin-bottom: 30px; display: table; width: 100%; }
        .info-box { display: table-cell; width: 50%; vertical-align: top; }
        .stat-grid { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        .stat-grid td { padding: 15px; border: 1px solid #eee; background: #f9f9f9; }
        .stat-label { font-size: 11px; text-transform: uppercase; color: #888; font-weight: bold; }
        .stat-value { font-size: 18px; color: #8B5E83; font-weight: bold; }
        .table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        .table th { background: #8B5E83; color: white; text-align: left; padding: 10px; font-size: 12px; }
        .table td { padding: 10px; border-bottom: 1px solid #eee; font-size: 12px; }
        .footer { text-align: center; font-size: 10px; color: #aaa; margin-top: 50px; border-top: 1px solid #eee; padding-top: 10px; }
        .badge { padding: 3px 8px; border-radius: 10px; font-size: 10px; font-weight: bold; }
        .badge-success { background: #d4edda; color: #155724; }
        .badge-warning { background: #fff3cd; color: #856404; }
        .total-row { font-weight: bold; background: #f8f9fa; }
    </style>
</head>
<body>
    <div class="header">
        @php
            $path = public_path('logo.png');
            $type = pathinfo($path, PATHINFO_EXTENSION);
            $data = file_exists($path) ? file_get_contents($path) : null;
            $base64 = $data ? 'data:image/' . $type . ';base64,' . base64_encode($data) : null;
        @endphp
        @if($base64)
            <img src="{{ $base64 }}" class="logo">
        @endif
        <h1>Boutique Magdiela</h1>
        <div class="subtitle">Reporte de Ventas y Finanzas</div>
    </div>

    <div class="info-section">
        <div class="info-box">
            <p><strong>Periodo:</strong> {{ $from }} al {{ $to }}</p>
            <p><strong>Fecha de Generación:</strong> {{ date('d/m/Y H:i') }}</p>
        </div>
        <div class="info-box" style="text-align: right;">
            <p><strong>Estado del Negocio:</strong> <span class="badge badge-success">Activo</span></p>
        </div>
    </div>

    <table class="stat-grid">
        <tr>
            <td>
                <div class="stat-label">Ingresos Totales</div>
                <div class="stat-value">${{ number_format($total_revenue, 2) }}</div>
            </td>
            <td>
                <div class="stat-label">Ganancia Neta</div>
                <div class="stat-value" style="color: #6ECB8B;">${{ number_format($profit, 2) }}</div>
            </td>
        </tr>
        <tr>
            <td>
                <div class="stat-label">Total de Ventas</div>
                <div class="stat-value">{{ $total_sales }}</div>
            </td>
            <td>
                <div class="stat-label">Deuda Total Activa</div>
                <div class="stat-value" style="color: #E85D6F;">${{ number_format($total_debt, 2) }}</div>
            </td>
        </tr>
    </table>



    @if(count($active_debts) > 0)
    <h3>Detalle de Cuentas por Cobrar (Créditos Pendientes)</h3>
    <table class="table">
        <thead>
            <tr>
                <th>Clienta</th>
                <th>Total del Crédito</th>
                <th>Pagado</th>
                <th>Saldo Pendiente</th>
                <th>Fecha Límite</th>
            </tr>
        </thead>
        <tbody>
            @foreach($active_debts as $debt)
            <tr>
                <td>{{ $debt->client->name }}</td>
                <td>${{ number_format($debt->total_amount, 2) }}</td>
                <td>${{ number_format($debt->paid_amount, 2) }}</td>
                <td style="color: #E85D6F; font-weight: bold;">${{ number_format($debt->balance, 2) }}</td>
                <td>{{ $debt->due_date ? date('d/m/Y', strtotime($debt->due_date)) : 'N/A' }}</td>
            </tr>
            @endforeach
            <tr class="total-row">
                <td colspan="3" style="text-align: right;">Total Pendiente:</td>
                <td style="color: #E85D6F;">${{ number_format($total_debt, 2) }}</td>
                <td></td>
            </tr>
        </tbody>
    </table>
    @endif

    <div class="footer">
        Este documento es un reporte oficial generado por el sistema Magdiela Control Interno.<br>
        &copy; {{ date('Y') }} Boutique Magdiela. Todos los derechos reservados.
    </div>
</body>
</html>
