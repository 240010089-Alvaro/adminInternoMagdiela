<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Reporte Administrativo - Boutique Magdiela</title>
    <style>
        @page { margin: 40px; }
        body { 
            font-family: 'Helvetica', 'Arial', sans-serif; 
            color: #1A1423; 
            line-height: 1.4; 
            margin: 0;
            padding: 0;
        }
        
        /* Typography */
        h1, h2, h3 { margin: 0; font-weight: bold; }
        .text-muted { color: #666; font-size: 11px; }
        .text-accent { color: #D4A574; }
        .text-primary { color: #8B5E83; }
        .text-success { color: #2D6A4F; }
        .text-danger { color: #A4161A; }
        
        /* Header */
        .header { 
            position: relative;
            padding-bottom: 20px;
            margin-bottom: 30px;
            border-bottom: 3px solid #8B5E83;
        }
        .header-content { display: block; width: 100%; }
        .logo-container { float: left; width: 60px; height: 60px; }
        .title-container { float: left; margin-left: 15px; }
        .date-container { float: right; text-align: right; }
        .clearfix::after { content: ""; clear: both; display: table; }

        h1 { font-size: 26px; color: #8B5E83; letter-spacing: 1px; text-transform: uppercase; }
        .subtitle { color: #D4A574; font-size: 12px; font-weight: bold; letter-spacing: 3px; text-transform: uppercase; }

        /* Stats Cards */
        .stats-container { margin-bottom: 30px; width: 100%; }
        .stat-card {
            width: 23%;
            float: left;
            margin-right: 2%;
            background: #F8F9FA;
            border-radius: 10px;
            padding: 12px;
            border: 1px solid #E9ECEF;
            text-align: center;
        }
        .stat-card:last-child { margin-right: 0; }
        .stat-label { font-size: 9px; text-transform: uppercase; color: #888; font-weight: bold; margin-bottom: 5px; }
        .stat-value { font-size: 16px; font-weight: bold; color: #1A1423; }
        
        /* Sections */
        .section-title {
            background: #F4F0F2;
            padding: 8px 15px;
            border-left: 5px solid #8B5E83;
            font-size: 13px;
            text-transform: uppercase;
            color: #8B5E83;
            margin-bottom: 15px;
            font-weight: bold;
        }

        /* Tables */
        .table { width: 100%; border-collapse: collapse; margin-bottom: 25px; border-radius: 8px; overflow: hidden; }
        .table th { 
            background: #8B5E83; 
            color: white; 
            text-align: left; 
            padding: 10px 12px; 
            font-size: 10px; 
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .table td { 
            padding: 10px 12px; 
            border-bottom: 1px solid #EEE; 
            font-size: 11px; 
            color: #333;
        }
        .table tr:nth-child(even) { background-color: #FAF8F9; }
        .table tr.total-row { background: #F4F0F2; font-weight: bold; }
        
        .badge {
            padding: 4px 8px;
            border-radius: 6px;
            font-size: 9px;
            font-weight: bold;
            display: inline-block;
        }
        .badge-cash { background: #D4EDDA; color: #155724; }
        .badge-credit { background: #F8D7DA; color: #721C24; }

        /* Footer */
        .footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 9px;
            color: #999;
            padding: 15px 0;
            border-top: 1px solid #EEE;
        }
        
        .currency { font-family: DejaVu Sans, sans-serif; }
    </style>
</head>
<body>
    <div class="header clearfix">
        <div class="title-container">
            <h1>Boutique Magdiela</h1>
            <div class="subtitle">Reporte Administrativo</div>
        </div>
        <div class="date-container">
            <div style="font-weight: bold; font-size: 12px;">{{ $from === $to ? 'Ventas del Día' : 'Resumen de Periodo' }}</div>
            <div class="text-muted">{{ $from }} {{ $from !== $to ? ' al ' . $to : '' }}</div>
            <div class="text-muted" style="margin-top: 5px;">Generado: {{ date('d/m/Y H:i') }}</div>
        </div>
    </div>

    <div class="stats-container clearfix">
        <div class="stat-card">
            <div class="stat-label">Ventas Totales</div>
            <div class="stat-value">{{ $total_sales }}</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">Ingresos Brutos</div>
            <div class="stat-value"><span class="currency">$</span>{{ number_format($total_revenue, 2) }}</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">Ganancia Neta</div>
            <div class="stat-value text-success"><span class="currency">$</span>{{ number_format($profit, 2) }}</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">Deuda Pendiente</div>
            <div class="stat-value text-danger"><span class="currency">$</span>{{ number_format($total_debt, 2) }}</div>
        </div>
    </div>

    <div class="section-title">Resumen de Métodos de Pago</div>
    <table class="table">
        <thead>
            <tr>
                <th>Método</th>
                <th>Operaciones</th>
                <th style="text-align: right;">Total Recaudado</th>
            </tr>
        </thead>
        <tbody>
            @foreach($sales_by_payment as $payment)
            <tr>
                <td>
                    <span class="badge {{ $payment->payment_method === 'efectivo' ? 'badge-cash' : 'badge-credit' }}">
                        {{ strtoupper($payment->payment_method) }}
                    </span>
                </td>
                <td>{{ $payment->count }} ventas</td>
                <td style="text-align: right; font-weight: bold;"><span class="currency">$</span>{{ number_format($payment->total, 2) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    @if(count($credits_issued) > 0)
    <div class="section-title">Créditos Otorgados (Fiados hoy)</div>
    <table class="table">
        <thead>
            <tr>
                <th>Fecha</th>
                <th>Clienta</th>
                <th>Monto Fiado</th>
                <th>Abonado</th>
                <th>Saldo Pendiente</th>
                <th>Vence</th>
            </tr>
        </thead>
        <tbody>
            @foreach($credits_issued as $credit)
            <tr>
                <td>{{ date('d/m/Y', strtotime($credit->created_at)) }}</td>
                <td style="font-weight: bold;">{{ $credit->client->name }}</td>
                <td><span class="currency">$</span>{{ number_format($credit->total_amount, 2) }}</td>
                <td class="text-success"><span class="currency">$</span>{{ number_format($credit->paid_amount, 2) }}</td>
                <td class="text-danger" style="font-weight: bold;"><span class="currency">$</span>{{ number_format($credit->balance, 2) }}</td>
                <td>{{ $credit->due_date ? date('d/m/Y', strtotime($credit->due_date)) : 'N/A' }}</td>
            </tr>
            @endforeach
            <tr class="total-row">
                <td colspan="4" style="text-align: right;">Total Fiado en el Periodo:</td>
                <td class="text-danger"><span class="currency">$</span>{{ number_format(collect($credits_issued)->sum('balance'), 2) }}</td>
                <td></td>
            </tr>
        </tbody>
    </table>
    @endif

    @if(count($active_debts) > 0)
    <div class="section-title">Estado de Cuentas por Cobrar (Saldos Pendientes)</div>
    <table class="table">
        <thead>
            <tr>
                <th>Clienta</th>
                <th>Crédito Original</th>
                <th>Pagado</th>
                <th>Saldo Actual</th>
                <th>Última Actividad</th>
            </tr>
        </thead>
        <tbody>
            @php $topDebts = collect($active_debts)->take(10); @endphp
            @foreach($topDebts as $debt)
            <tr>
                <td style="font-weight: bold;">{{ $debt->client->name }}</td>
                <td><span class="currency">$</span>{{ number_format($debt->total_amount, 2) }}</td>
                <td class="text-success"><span class="currency">$</span>{{ number_format($debt->paid_amount, 2) }}</td>
                <td class="text-danger" style="font-weight: bold;"><span class="currency">$</span>{{ number_format($debt->balance, 2) }}</td>
                <td>{{ date('d/m/Y', strtotime($debt->created_at)) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
    @if(count($active_debts) > 10)
    <div class="text-muted" style="text-align: right; margin-top: -15px; margin-bottom: 20px;">* Mostrando solo los 10 saldos más altos.</div>
    @endif
    @endif

    <div class="footer">
        Este es un documento privado de <strong>Boutique Magdiela</strong>. Generado automáticamente por el sistema de control interno.<br>
        © {{ date('Y') }} Magdiela Software.
    </div>
</body>
</html>
