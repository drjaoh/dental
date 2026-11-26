import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { CreditCard, Building2, ArrowUpRight, Download, Search, Filter, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import Header from 'components/ui/Header';
import Sidebar from 'components/ui/Sidebar';
import Button from 'components/ui/Button';
import Input from 'components/ui/Input';
import Select from 'components/ui/Select';

const PaymentProcessing = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cash');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('');
  const [transactionFilters, setTransactionFilters] = useState({
    method: 'all',
    status: 'all',
    dateRange: '7days'
  });

  const paymentMethods = [
    { id: 'cash', label: 'Efectivo', icon: <CreditCard className="w-5 h-5" />, color: 'green' },
    { id: 'card', label: 'Tarjeta de Crédito/Débito', icon: <CreditCard className="w-5 h-5" />, color: 'blue' },
    { id: 'transfer', label: 'Transferencia Bancaria', icon: <Building2 className="w-5 h-5" />, color: 'purple' },
    { id: 'spei', label: 'SPEI (Pago Interbancario)', icon: <ArrowUpRight className="w-5 h-5" />, color: 'orange' }
  ];

  const recentTransactions = [
    { id: 'TXN001', patient: 'María García López', amount: 2500, method: 'SPEI', status: 'completed', date: '2025-09-08', time: '14:30' },
    { id: 'TXN002', patient: 'Carlos Rodríguez', amount: 1800, method: 'Transferencia', status: 'pending', date: '2025-09-08', time: '13:15' },
    { id: 'TXN003', patient: 'Ana Martínez', amount: 950, method: 'Efectivo', status: 'completed', date: '2025-09-08', time: '11:45' },
    { id: 'TXN004', patient: 'Luis Hernández', amount: 3200, method: 'Tarjeta', status: 'completed', date: '2025-09-07', time: '16:20' },
    { id: 'TXN005', patient: 'Patricia López', amount: 1500, method: 'SPEI', status: 'failed', date: '2025-09-07', time: '10:30' }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completado';
      case 'pending':
        return 'Pendiente';
      case 'failed':
        return 'Fallido';
      default:
        return status;
    }
  };

  const handlePaymentSubmit = (e) => {
    e?.preventDefault();
    console.log('Processing payment:', {
      method: selectedPaymentMethod,
      amount: paymentAmount,
      patient: selectedPatient
    });
  };

  return (
    <>
      <Helmet>
        <title>Procesamiento de Pagos - Sistema Dental</title>
        <meta name="description" content="Gestión completa de pagos con integración SPEI y transferencias bancarias para consultas dentales" />
      </Helmet>
      <div className="flex h-screen bg-gray-50">
        <Sidebar onToggle={() => {}} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
              {/* Header Section */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Procesamiento de Pagos</h1>
                <p className="mt-2 text-gray-600">Gestiona pagos, transferencias y transacciones SPEI para tu práctica dental</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Payment Processing Form */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Procesar Nuevo Pago</h2>
                    
                    <form onSubmit={handlePaymentSubmit} className="space-y-6">
                      {/* Patient Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Seleccionar Paciente
                        </label>
                        <Select
                          value={selectedPatient}
                          onChange={(e) => setSelectedPatient(e?.target?.value)}
                          className="w-full"
                        >
                          <option value="">Selecciona un paciente...</option>
                          <option value="maria-garcia">María García López</option>
                          <option value="carlos-rodriguez">Carlos Rodríguez</option>
                          <option value="ana-martinez">Ana Martínez</option>
                          <option value="luis-hernandez">Luis Hernández</option>
                        </Select>
                      </div>

                      {/* Payment Amount */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Monto del Pago
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                          <Input
                            type="number"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e?.target?.value)}
                            placeholder="0.00"
                            className="pl-8"
                            min="0"
                            step="0.01"
                          />
                        </div>
                      </div>

                      {/* Payment Method Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-4">
                          Método de Pago
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {paymentMethods?.map((method) => (
                            <div
                              key={method?.id}
                              className={`relative cursor-pointer rounded-lg border p-4 focus:outline-none ${
                                selectedPaymentMethod === method?.id
                                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500' : 'border-gray-300 hover:border-gray-400'
                              }`}
                              onClick={() => setSelectedPaymentMethod(method?.id)}
                            >
                              <div className="flex items-start">
                                <div className={`text-${method?.color}-500 mr-3`}>
                                  {method?.icon}
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-sm font-medium text-gray-900">
                                    {method?.label}
                                  </h3>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* SPEI Details */}
                      {selectedPaymentMethod === 'spei' && (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                          <h4 className="font-medium text-orange-900 mb-2">Información SPEI</h4>
                          <div className="text-sm text-orange-700 space-y-1">
                            <p><strong>CLABE:</strong> 012345678901234567</p>
                            <p><strong>Banco:</strong> BBVA México</p>
                            <p><strong>Beneficiario:</strong> Clínica Dental Sonrisa</p>
                            <p className="text-xs mt-2">Los pagos SPEI se procesan inmediatamente las 24 horas del día</p>
                          </div>
                        </div>
                      )}

                      {/* Bank Transfer Details */}
                      {selectedPaymentMethod === 'transfer' && (
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                          <h4 className="font-medium text-purple-900 mb-2">Información de Transferencia</h4>
                          <div className="text-sm text-purple-700 space-y-1">
                            <p><strong>Cuenta:</strong> 1234567890</p>
                            <p><strong>Banco:</strong> Santander México</p>
                            <p><strong>Sucursal:</strong> 1234</p>
                            <p className="text-xs mt-2">Las transferencias pueden tardar de 1 a 3 días hábiles en procesarse</p>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-3">
                        <Button type="submit" className="flex-1">
                          Procesar Pago
                        </Button>
                        <Button variant="outline" type="button">
                          Generar Recibo
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Transaction Summary */}
                <div className="space-y-6">
                  {/* Quick Stats */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen de Hoy</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Cobrado</span>
                        <span className="font-semibold text-green-600">$8,950</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Transacciones</span>
                        <span className="font-semibold">15</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pendientes</span>
                        <span className="font-semibold text-yellow-600">2</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Methods Performance */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Métodos de Pago</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">SPEI</span>
                        <span className="font-semibold">45%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tarjeta</span>
                        <span className="font-semibold">30%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Efectivo</span>
                        <span className="font-semibold">25%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transaction History */}
              <div className="mt-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <h2 className="text-xl font-semibold text-gray-900">Historial de Transacciones</h2>
                      
                      <div className="flex gap-3">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            placeholder="Buscar transacciones..."
                            className="pl-10 w-64"
                          />
                        </div>
                        <Button variant="outline" size="sm">
                          <Filter className="w-4 h-4 mr-2" />
                          Filtros
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Exportar
                        </Button>
                      </div>
                    </div>

                    {/* Filters */}
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Select
                        value={transactionFilters?.method}
                        onChange={(e) => setTransactionFilters(prev => ({ ...prev, method: e?.target?.value }))}
                      >
                        <option value="all">Todos los métodos</option>
                        <option value="spei">SPEI</option>
                        <option value="transfer">Transferencia</option>
                        <option value="card">Tarjeta</option>
                        <option value="cash">Efectivo</option>
                      </Select>

                      <Select
                        value={transactionFilters?.status}
                        onChange={(e) => setTransactionFilters(prev => ({ ...prev, status: e?.target?.value }))}
                      >
                        <option value="all">Todos los estados</option>
                        <option value="completed">Completado</option>
                        <option value="pending">Pendiente</option>
                        <option value="failed">Fallido</option>
                      </Select>

                      <Select
                        value={transactionFilters?.dateRange}
                        onChange={(e) => setTransactionFilters(prev => ({ ...prev, dateRange: e?.target?.value }))}
                      >
                        <option value="7days">Últimos 7 días</option>
                        <option value="30days">Últimos 30 días</option>
                        <option value="90days">Últimos 3 meses</option>
                        <option value="year">Último año</option>
                      </Select>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ID Transacción
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Paciente
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Monto
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Método
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Estado
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Fecha y Hora
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {recentTransactions?.map((transaction) => (
                          <tr key={transaction?.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {transaction?.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {transaction?.patient}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ${transaction?.amount?.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {transaction?.method}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {getStatusIcon(transaction?.status)}
                                <span className={`ml-2 text-sm font-medium ${
                                  transaction?.status === 'completed' ? 'text-green-600' :
                                  transaction?.status === 'pending'? 'text-yellow-600' : 'text-red-600'
                                }`}>
                                  {getStatusText(transaction?.status)}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <div>
                                <div>{transaction?.date}</div>
                                <div className="text-gray-500">{transaction?.time}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <Button variant="ghost" size="sm">
                                Ver Recibo
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default PaymentProcessing;