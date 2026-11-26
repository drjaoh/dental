import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Plus, Upload, Calendar, Eye, Edit3, Share2, Download, TrendingUp, Users, Target, Tag } from 'lucide-react';
import Header from 'components/ui/Header';
import Sidebar from 'components/ui/Sidebar';
import Button from 'components/ui/Button';
import Input from 'components/ui/Input';
import Select from 'components/ui/Select';

const PromotionsManagement = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Add this state for sidebar
  const [newPromotion, setNewPromotion] = useState({
    title: '',
    type: 'discount',
    discount: '',
    validUntil: '',
    description: '',
    image: null
  });

  const activePromotions = [
    {
      id: 'PROMO001',
      title: 'Limpieza Dental Especial',
      type: 'Descuento por Tratamiento',
      discount: '20%',
      validUntil: '2025-09-30',
      image: '/api/placeholder/300/200',
      views: 1250,
      engagement: 85,
      conversions: 23,
      status: 'active',
      createdDate: '2025-08-15',
      description: 'Promoción especial de limpieza dental con descuento del 20% válida durante septiembre'
    },
    {
      id: 'PROMO002', 
      title: 'Blanqueamiento de Otoño',
      type: 'Paquete Promocional',
      discount: '15%',
      validUntil: '2025-10-15',
      image: '/api/placeholder/300/200',
      views: 892,
      engagement: 72,
      conversions: 18,
      status: 'active',
      createdDate: '2025-08-20',
      description: 'Oferta especial de blanqueamiento dental para la temporada de otoño'
    },
    {
      id: 'PROMO003',
      title: 'Ortodoncia Juvenil',
      type: 'Descuento Familiar',
      discount: '25%',
      validUntil: '2025-11-30',
      image: '/api/placeholder/300/200',
      views: 654,
      engagement: 68,
      conversions: 15,
      status: 'active',
      createdDate: '2025-09-01',
      description: 'Promoción especial para tratamientos de ortodoncia en pacientes menores de 18 años'
    }
  ];

  const expiredPromotions = [
    {
      id: 'PROMO004',
      title: 'Revisión de Verano',
      type: 'Consulta Gratuita',
      discount: '100%',
      validUntil: '2025-08-31',
      image: '/api/placeholder/300/200',
      views: 2150,
      engagement: 94,
      conversions: 48,
      status: 'expired',
      createdDate: '2025-06-15',
      description: 'Consulta gratuita durante los meses de verano para nuevos pacientes'
    }
  ];

  const promotionTypes = [
    { value: 'discount', label: 'Descuento por Tratamiento' },
    { value: 'package', label: 'Paquete Promocional' },
    { value: 'referral', label: 'Programa de Referencias' },
    { value: 'seasonal', label: 'Campaña Estacional' },
    { value: 'free', label: 'Consulta Gratuita' }
  ];

  const handleCreatePromotion = (e) => {
    e?.preventDefault();
    console.log('Creating promotion:', newPromotion);
    setShowCreateModal(false);
    setNewPromotion({
      title: '',
      type: 'discount',
      discount: '',
      validUntil: '',
      description: '',
      image: null
    });
  };

  const handleImageUpload = (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      setNewPromotion(prev => ({ ...prev, image: file }));
    }
  };

  const renderPromotionCard = (promotion) => (
    <div key={promotion?.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="aspect-video bg-gray-200 relative">
        <img 
          src={promotion?.image} 
          alt={promotion?.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            promotion?.status === 'active' ?'bg-green-100 text-green-800' :'bg-gray-100 text-gray-800'
          }`}>
            {promotion?.status === 'active' ? 'Activa' : 'Expirada'}
          </span>
        </div>
        <div className="absolute top-3 right-3 flex gap-2">
          <Button size="sm" variant="ghost" className="bg-white/90 hover:bg-white">
            <Edit3 className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost" className="bg-white/90 hover:bg-white">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{promotion?.title}</h3>
          <span className="text-lg font-bold text-blue-600">{promotion?.discount} OFF</span>
        </div>
        
        <p className="text-sm text-gray-600 mb-3">{promotion?.description}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{promotion?.views}</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              <span>{promotion?.engagement}%</span>
            </div>
            <div className="flex items-center gap-1">
              <Target className="w-4 h-4" />
              <span>{promotion?.conversions}</span>
            </div>
          </div>
          <span>Válida hasta: {promotion?.validUntil}</span>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Eye className="w-4 h-4 mr-2" />
            Ver Detalles
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4" />
          </Button>
          {promotion?.status === 'expired' && (
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Gestión de Promociones - Sistema Dental</title>
        <meta name="description" content="Crea y gestiona promociones dentales con imágenes y actualizaciones mensuales" />
      </Helmet>
      <div className="flex h-screen bg-gray-50">
        <Sidebar onToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
              {/* Header Section */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Gestión de Promociones</h1>
                  <p className="mt-2 text-gray-600">Crea y administra campañas promocionales para tu práctica dental</p>
                </div>
                <Button onClick={() => setShowCreateModal(true)} className="mt-4 sm:mt-0">
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Promoción
                </Button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Tag className="h-8 w-8 text-blue-500" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">Promociones Activas</h3>
                      <p className="text-2xl font-bold text-blue-600">3</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Eye className="h-8 w-8 text-green-500" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">Total Visualizaciones</h3>
                      <p className="text-2xl font-bold text-green-600">2,796</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Users className="h-8 w-8 text-purple-500" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">Engagement Promedio</h3>
                      <p className="text-2xl font-bold text-purple-600">75%</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Target className="h-8 w-8 text-orange-500" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">Conversiones</h3>
                      <p className="text-2xl font-bold text-orange-600">56</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex">
                    <button
                      onClick={() => setActiveTab('active')}
                      className={`py-4 px-6 text-sm font-medium border-b-2 ${
                        activeTab === 'active' ?'border-blue-500 text-blue-600' :'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Promociones Activas ({activePromotions?.length})
                    </button>
                    <button
                      onClick={() => setActiveTab('expired')}
                      className={`py-4 px-6 text-sm font-medium border-b-2 ${
                        activeTab === 'expired' ?'border-blue-500 text-blue-600' :'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Promociones Expiradas ({expiredPromotions?.length})
                    </button>
                    <button
                      onClick={() => setActiveTab('analytics')}
                      className={`py-4 px-6 text-sm font-medium border-b-2 ${
                        activeTab === 'analytics' ?'border-blue-500 text-blue-600' :'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Análisis
                    </button>
                  </nav>
                </div>

                <div className="p-6">
                  {/* Active Promotions */}
                  {activeTab === 'active' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {activePromotions?.map(renderPromotionCard)}
                    </div>
                  )}

                  {/* Expired Promotions */}
                  {activeTab === 'expired' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {expiredPromotions?.map(renderPromotionCard)}
                    </div>
                  )}

                  {/* Analytics Tab */}
                  {activeTab === 'analytics' && (
                    <div className="space-y-6">
                      <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold mb-4">Rendimiento de Promociones</h3>
                        <div className="space-y-4">
                          {activePromotions?.map((promotion) => (
                            <div key={promotion?.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                              <div className="flex-1">
                                <h4 className="font-medium">{promotion?.title}</h4>
                                <p className="text-sm text-gray-600">{promotion?.type}</p>
                              </div>
                              <div className="flex gap-8 text-sm">
                                <div className="text-center">
                                  <p className="font-semibold">{promotion?.views}</p>
                                  <p className="text-gray-500">Vistas</p>
                                </div>
                                <div className="text-center">
                                  <p className="font-semibold">{promotion?.engagement}%</p>
                                  <p className="text-gray-500">Engagement</p>
                                </div>
                                <div className="text-center">
                                  <p className="font-semibold">{promotion?.conversions}</p>
                                  <p className="text-gray-500">Conversiones</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Monthly Update Reminder */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start">
                  <Calendar className="h-6 w-6 text-blue-500 mr-3 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-blue-900">Recordatorio de Actualización Mensual</h3>
                    <p className="text-blue-700 mt-1">Es hora de revisar y actualizar tus promociones. Se recomienda actualizar el contenido promocional cada mes para mantener el engagement alto.</p>
                    <div className="mt-4 flex gap-3">
                      <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                        Ver Calendario de Actualizaciones
                      </Button>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Programar Recordatorio
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      {/* Create Promotion Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Nueva Promoción</h2>
              
              <form onSubmit={handleCreatePromotion} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título de la Promoción
                  </label>
                  <Input
                    value={newPromotion?.title}
                    onChange={(e) => setNewPromotion(prev => ({ ...prev, title: e?.target?.value }))}
                    placeholder="Ej: Limpieza Dental Especial"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Promoción
                  </label>
                  <Select
                    value={newPromotion?.type}
                    onChange={(e) => setNewPromotion(prev => ({ ...prev, type: e?.target?.value }))}
                    required
                  >
                    {promotionTypes?.map((type) => (
                      <option key={type?.value} value={type?.value}>
                        {type?.label}
                      </option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descuento (%)
                  </label>
                  <Input
                    type="number"
                    value={newPromotion?.discount}
                    onChange={(e) => setNewPromotion(prev => ({ ...prev, discount: e?.target?.value }))}
                    placeholder="20"
                    min="0"
                    max="100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Válida Hasta
                  </label>
                  <Input
                    type="date"
                    value={newPromotion?.validUntil}
                    onChange={(e) => setNewPromotion(prev => ({ ...prev, validUntil: e?.target?.value }))}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={newPromotion?.description}
                    onChange={(e) => setNewPromotion(prev => ({ ...prev, description: e?.target?.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    placeholder="Describe los detalles de la promoción..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Imagen Promocional
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                          <span>Subir imagen</span>
                          <input
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                        </label>
                        <p className="pl-1">o arrastra y suelta</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1">
                    Crear Promoción
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PromotionsManagement;