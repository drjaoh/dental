import React, { useState, useEffect } from 'react';

import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import DocumentTypeCard from './components/DocumentTypeCard';
import TemplateGrid from './components/TemplateGrid';
import DocumentPreview from './components/DocumentPreview';
import QuickActions from './components/QuickActions';
import RecentDocuments from './components/RecentDocuments';
import DocumentStats from './components/DocumentStats';

const DocumentGeneration = () => {
  const [selectedType, setSelectedType] = useState('quotation');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [previewDocument, setPreviewDocument] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for document types
  const documentTypes = [
    {
      type: 'quotation',
      title: 'Cotizaciones',
      description: 'Genera cotizaciones detalladas con costos de tratamientos y opciones de pago',
      icon: 'Calculator',
      count: 15
    },
    {
      type: 'consent',
      title: 'Consentimientos',
      description: 'Formularios de consentimiento informado para tratamientos dentales',
      icon: 'FileCheck',
      count: 8
    },
    {
      type: 'report',
      title: 'Reportes Clínicos',
      description: 'Reportes de evolución clínica y hallazgos de tratamientos',
      icon: 'FileText',
      count: 12
    },
    {
      type: 'statement',
      title: 'Estados de Cuenta',
      description: 'Estados de cuenta detallados con historial de pagos y saldos',
      icon: 'FileSpreadsheet',
      count: 6
    }
  ];

  // Mock templates data
  const mockTemplates = {
    quotation: [
      {
        id: 'q1',
        name: 'Cotización Estándar',
        description: 'Plantilla básica para cotizaciones de tratamientos generales',
        category: 'quotation',
        categoryLabel: 'Cotización',
        preview: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=600&fit=crop',
        isDefault: true,
        usageCount: 45,
        lastModified: '2 días'
      },
      {
        id: 'q2',
        name: 'Cotización Ortodoncia',
        description: 'Plantilla especializada para tratamientos de ortodoncia',
        category: 'quotation',
        categoryLabel: 'Cotización',
        preview: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400&h=600&fit=crop',
        isDefault: false,
        usageCount: 23,
        lastModified: '1 semana'
      },
      {
        id: 'q3',
        name: 'Cotización Implantes',
        description: 'Plantilla para cotizaciones de implantes dentales',
        category: 'quotation',
        categoryLabel: 'Cotización',
        preview: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=400&h=600&fit=crop',
        isDefault: false,
        usageCount: 18,
        lastModified: '3 días'
      }
    ],
    consent: [
      {
        id: 'c1',
        name: 'Consentimiento General',
        description: 'Formulario de consentimiento para tratamientos generales',
        category: 'consent',
        categoryLabel: 'Consentimiento',
        preview: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=600&fit=crop',
        isDefault: true,
        usageCount: 67,
        lastModified: '1 día'
      },
      {
        id: 'c2',
        name: 'Consentimiento Cirugía',
        description: 'Formulario específico para procedimientos quirúrgicos',
        category: 'consent',
        categoryLabel: 'Consentimiento',
        preview: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=600&fit=crop',
        isDefault: false,
        usageCount: 34,
        lastModified: '4 días'
      }
    ],
    report: [
      {
        id: 'r1',
        name: 'Reporte de Evolución',
        description: 'Plantilla para reportes de evolución de tratamientos',
        category: 'report',
        categoryLabel: 'Reporte',
        preview: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400&h=600&fit=crop',
        isDefault: true,
        usageCount: 29,
        lastModified: '2 días'
      },
      {
        id: 'r2',
        name: 'Reporte Post-Operatorio',
        description: 'Plantilla para reportes después de procedimientos',
        category: 'report',
        categoryLabel: 'Reporte',
        preview: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=600&fit=crop',
        isDefault: false,
        usageCount: 15,
        lastModified: '1 semana'
      }
    ],
    statement: [
      {
        id: 's1',
        name: 'Estado de Cuenta Mensual',
        description: 'Plantilla para estados de cuenta mensuales',
        category: 'statement',
        categoryLabel: 'Estado de Cuenta',
        preview: 'https://images.unsplash.com/photo-1554224154-26032fced8bd?w=400&h=600&fit=crop',
        isDefault: true,
        usageCount: 52,
        lastModified: '1 día'
      }
    ]
  };

  // Mock recent documents
  const recentDocuments = [
    {
      id: 'doc1',
      title: 'Cotización - Tratamiento Integral',
      type: 'quotation',
      patientName: 'Ana Martínez',
      status: 'sent',
      createdAt: '08/01/2025',
      size: '245 KB'
    },
    {
      id: 'doc2',
      title: 'Consentimiento - Extracción Molar',
      type: 'consent',
      patientName: 'Carlos López',
      status: 'signed',
      createdAt: '07/01/2025',
      size: '189 KB'
    },
    {
      id: 'doc3',
      title: 'Reporte - Evolución Ortodoncia',
      type: 'report',
      patientName: 'María González',
      status: 'draft',
      createdAt: '06/01/2025',
      size: '312 KB'
    },
    {
      id: 'doc4',
      title: 'Estado de Cuenta - Diciembre 2024',
      type: 'statement',
      patientName: 'Roberto Silva',
      status: 'pending',
      createdAt: '05/01/2025',
      size: '156 KB'
    }
  ];

  // Mock document stats
  const documentStats = {
    totalDocuments: 156,
    quotationsSent: 45,
    formsSigned: 23,
    reportsGenerated: 34
  };

  // Filter options
  const filterOptions = [
    { value: 'all', label: 'Todos los tipos' },
    { value: 'quotation', label: 'Cotizaciones' },
    { value: 'consent', label: 'Consentimientos' },
    { value: 'report', label: 'Reportes' },
    { value: 'statement', label: 'Estados de Cuenta' }
  ];

  const handleSelectType = (type) => {
    setSelectedType(type);
    setSelectedTemplate(null);
    setPreviewDocument(null);
  };

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    // Generate mock document for preview
    const mockDocument = generateMockDocument(template);
    setPreviewDocument(mockDocument);
  };

  const generateMockDocument = (template) => {
    const baseDocument = {
      id: `doc_${Date.now()}`,
      title: template?.name,
      type: template?.category,
      patientName: 'Ana Martínez García',
      patientPhone: '(55) 1234-5678',
      patientEmail: 'ana.martinez@email.com'
    };

    switch (template?.category) {
      case 'quotation':
        return {
          ...baseDocument,
          treatments: [
            { name: 'Limpieza Dental', quantity: 1, unitPrice: 800, total: 800 },
            { name: 'Resina Compuesta', quantity: 2, unitPrice: 1200, total: 2400 },
            { name: 'Corona de Porcelana', quantity: 1, unitPrice: 4500, total: 4500 }
          ],
          total: 7700
        };
      case 'consent':
        return {
          ...baseDocument,
          treatmentDescription: 'Extracción de tercer molar inferior derecho bajo anestesia local',
          risks: `Los riesgos asociados incluyen pero no se limitan a: dolor post-operatorio, 
                   inflamación, sangrado, infección, daño a dientes adyacentes, 
                   parestesia temporal o permanente del nervio dentario inferior.`
        };
      case 'report':
        return {
          ...baseDocument,
          findings: `Paciente presenta caries profunda en pieza 36 con compromiso pulpar. 
                     Se observa inflamación gingival moderada en sector anterior inferior.`,
          diagnosis: 'Pulpitis irreversible en pieza 36, gingivitis marginal crónica',
          treatmentPlan: `1. Tratamiento endodóntico en pieza 36
                          2. Corona de porcelana sobre metal
                          3. Profilaxis y control de placa bacteriana`,
          recommendations: `Mantener higiene oral adecuada, uso de hilo dental diario, 
                           control cada 6 meses, evitar alimentos duros hasta completar tratamiento.`
        };
      case 'statement':
        return {
          ...baseDocument,
          transactions: [
            { date: '01/12/2024', concept: 'Consulta inicial', charge: 500, payment: 0, balance: 500 },
            { date: '05/12/2024', concept: 'Pago parcial', charge: 0, payment: 500, balance: 0 },
            { date: '10/12/2024', concept: 'Limpieza dental', charge: 800, payment: 0, balance: 800 },
            { date: '15/12/2024', concept: 'Resina compuesta', charge: 2400, payment: 1000, balance: 2200 }
          ],
          currentBalance: 2200
        };
      default:
        return baseDocument;
    }
  };

  const handleCreateNew = (type) => {
    setSelectedType(type);
    // In a real app, this would open a document creation modal
    console.log(`Creating new ${type} document`);
  };

  const handleEditTemplate = (template) => {
    // In a real app, this would open template editor
    console.log('Editing template:', template);
  };

  const handleQuickAction = (actionId) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      console.log('Quick action executed:', actionId);
    }, 1000);
  };

  const handleViewDocument = (document) => {
    // In a real app, this would open document viewer
    console.log('Viewing document:', document);
  };

  const handleDuplicateDocument = (document) => {
    // In a real app, this would duplicate the document
    console.log('Duplicating document:', document);
  };

  const handlePreviewAction = async (action) => {
    // Simulate async action
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Preview action:', action);
        resolve();
      }, 1000);
    });
  };

  const filteredTemplates = mockTemplates?.[selectedType] || [];

  return (
    <div className="min-h-screen bg-background pt-16 lg:pt-0 lg:pl-60">
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Generación de Documentos</h1>
            <p className="text-muted-foreground mt-2">
              Crea y gestiona documentos profesionales para tu práctica dental
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Input
                type="search"
                placeholder="Buscar plantillas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e?.target?.value)}
                className="w-64"
              />
              <Select
                options={filterOptions}
                value={filterType}
                onChange={setFilterType}
                placeholder="Filtrar por tipo"
                className="w-48"
              />
            </div>
            <Button
              variant="default"
              iconName="Plus"
              iconPosition="left"
              iconSize={16}
            >
              Nuevo Documento
            </Button>
          </div>
        </div>

        {/* Document Stats */}
        <DocumentStats stats={documentStats} />

        {/* Quick Actions */}
        <QuickActions onAction={handleQuickAction} />

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Document Types & Templates */}
          <div className="xl:col-span-2 space-y-8">
            {/* Document Types */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-6">Tipos de Documento</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {documentTypes?.map((type) => (
                  <DocumentTypeCard
                    key={type?.type}
                    type={type?.type}
                    title={type?.title}
                    description={type?.description}
                    icon={type?.icon}
                    count={type?.count}
                    isSelected={selectedType === type?.type}
                    onSelect={handleSelectType}
                    onCreateNew={handleCreateNew}
                  />
                ))}
              </div>
            </div>

            {/* Templates */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">
                  Plantillas - {documentTypes?.find(t => t?.type === selectedType)?.title}
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Settings"
                  iconPosition="left"
                  iconSize={16}
                >
                  Gestionar Plantillas
                </Button>
              </div>
              
              <TemplateGrid
                templates={filteredTemplates}
                selectedType={selectedType}
                onSelectTemplate={handleSelectTemplate}
                onEditTemplate={handleEditTemplate}
              />
            </div>
          </div>

          {/* Right Column - Preview & Recent Documents */}
          <div className="space-y-8">
            {/* Document Preview */}
            <div className="h-96 lg:h-[600px]">
              <DocumentPreview
                document={previewDocument}
                onClose={() => setPreviewDocument(null)}
                onSave={() => handlePreviewAction('save')}
                onPrint={() => handlePreviewAction('print')}
                onEmail={() => handlePreviewAction('email')}
                onDownload={() => handlePreviewAction('download')}
              />
            </div>

            {/* Recent Documents */}
            <RecentDocuments
              documents={recentDocuments}
              onViewDocument={handleViewDocument}
              onDuplicateDocument={handleDuplicateDocument}
            />
          </div>
        </div>

        {/* Mobile Bottom Spacing */}
        <div className="h-20 lg:hidden" />
      </div>
    </div>
  );
};

export default DocumentGeneration;