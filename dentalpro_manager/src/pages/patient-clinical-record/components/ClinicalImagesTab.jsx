import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ClinicalImagesTab = ({ images, onUpdateImages }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [formData, setFormData] = useState({
    images: images || []
  });

  const imageCategories = [
    { value: 'intraoral', label: 'Intraoral' },
    { value: 'extraoral', label: 'Extraoral' },
    { value: 'radiographic', label: 'Radiográfica' },
    { value: 'panoramic', label: 'Panorámica' },
    { value: 'periapical', label: 'Periapical' },
    { value: 'bitewing', label: 'Bitewing' },
    { value: 'progress', label: 'Progreso de Tratamiento' },
    { value: 'before_after', label: 'Antes y Después' }
  ];

  const mockImages = [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=400&h=300&fit=crop',
      category: 'intraoral',
      title: 'Vista frontal inicial',
      description: 'Fotografía intraoral frontal del paciente al inicio del tratamiento',
      date: '2024-01-15',
      tooth: '11-21',
      annotations: []
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop',
      category: 'radiographic',
      title: 'Radiografía panorámica',
      description: 'Radiografía panorámica completa para evaluación general',
      date: '2024-01-15',
      tooth: 'completa',
      annotations: []
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
      category: 'progress',
      title: 'Progreso semana 4',
      description: 'Evolución del tratamiento de ortodoncia después de 4 semanas',
      date: '2024-02-12',
      tooth: 'arcada completa',
      annotations: []
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400&h=300&fit=crop',
      category: 'periapical',
      title: 'Periapical molar superior',
      description: 'Radiografía periapical del primer molar superior derecho',
      date: '2024-01-20',
      tooth: '16',
      annotations: []
    }
  ];

  // Initialize with mock data if no images provided
  React.useEffect(() => {
    if (formData?.images?.length === 0) {
      setFormData({ images: mockImages });
    }
  }, []);

  const addNewImage = () => {
    const newImage = {
      id: Date.now(),
      url: '',
      category: 'intraoral',
      title: '',
      description: '',
      date: new Date()?.toISOString()?.split('T')?.[0],
      tooth: '',
      annotations: []
    };
    
    setFormData(prev => ({
      ...prev,
      images: [newImage, ...prev?.images]
    }));
  };

  const updateImage = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      images: prev?.images?.map(image => 
        image?.id === id ? { ...image, [field]: value } : image
      )
    }));
  };

  const deleteImage = (id) => {
    setFormData(prev => ({
      ...prev,
      images: prev?.images?.filter(image => image?.id !== id)
    }));
    if (selectedImage?.id === id) {
      setSelectedImage(null);
    }
  };

  const handleSave = () => {
    onUpdateImages(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      images: images || mockImages
    });
    setIsEditing(false);
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'intraoral': return 'bg-primary/10 text-primary';
      case 'extraoral': return 'bg-secondary/10 text-secondary';
      case 'radiographic': return 'bg-warning/10 text-warning';
      case 'panoramic': return 'bg-accent/10 text-accent';
      case 'periapical': return 'bg-success/10 text-success';
      case 'bitewing': return 'bg-error/10 text-error';
      case 'progress': return 'bg-primary/10 text-primary';
      case 'before_after': return 'bg-secondary/10 text-secondary';
      default: return 'bg-muted/10 text-muted-foreground';
    }
  };

  const groupedImages = formData?.images?.reduce((groups, image) => {
    const category = image?.category || 'intraoral';
    if (!groups?.[category]) {
      groups[category] = [];
    }
    groups?.[category]?.push(image);
    return groups;
  }, {});

  return (
    <div className="bg-card rounded-lg border border-border clinical-shadow">
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="Camera" size={20} color="var(--color-primary)" />
          <h3 className="text-lg font-semibold text-foreground">Imágenes Clínicas</h3>
        </div>
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                iconName="X"
                iconPosition="left"
                iconSize={16}
              >
                Cancelar
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleSave}
                iconName="Check"
                iconPosition="left"
                iconSize={16}
              >
                Guardar
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              iconName="Edit"
              iconPosition="left"
              iconSize={16}
            >
              Editar
            </Button>
          )}
        </div>
      </div>
      <div className="p-6">
        {/* Image Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Image" size={16} color="var(--color-primary)" />
              <span className="text-sm font-medium text-primary">Total</span>
            </div>
            <div className="text-2xl font-bold text-primary">{formData?.images?.length}</div>
          </div>
          
          <div className="bg-warning/10 p-4 rounded-lg border border-warning/20">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Zap" size={16} color="var(--color-warning)" />
              <span className="text-sm font-medium text-warning">Radiográficas</span>
            </div>
            <div className="text-2xl font-bold text-warning">
              {formData?.images?.filter(img => ['radiographic', 'panoramic', 'periapical', 'bitewing']?.includes(img?.category))?.length}
            </div>
          </div>
          
          <div className="bg-success/10 p-4 rounded-lg border border-success/20">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Eye" size={16} color="var(--color-success)" />
              <span className="text-sm font-medium text-success">Clínicas</span>
            </div>
            <div className="text-2xl font-bold text-success">
              {formData?.images?.filter(img => ['intraoral', 'extraoral']?.includes(img?.category))?.length}
            </div>
          </div>
          
          <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="TrendingUp" size={16} color="var(--color-accent)" />
              <span className="text-sm font-medium text-accent">Progreso</span>
            </div>
            <div className="text-2xl font-bold text-accent">
              {formData?.images?.filter(img => ['progress', 'before_after']?.includes(img?.category))?.length}
            </div>
          </div>
        </div>

        {/* Add New Image Button */}
        {isEditing && (
          <div className="mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={addNewImage}
              iconName="Plus"
              iconPosition="left"
              iconSize={16}
            >
              Agregar Nueva Imagen
            </Button>
          </div>
        )}

        {/* Images by Category */}
        <div className="space-y-8">
          {Object.entries(groupedImages)?.map(([category, categoryImages]) => (
            <div key={category}>
              <div className="flex items-center space-x-3 mb-4">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(category)}`}>
                  {imageCategories?.find(c => c?.value === category)?.label || category}
                </div>
                <span className="text-sm text-muted-foreground">
                  {categoryImages?.length} imagen{categoryImages?.length !== 1 ? 'es' : ''}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryImages?.map((image) => (
                  <div key={image?.id} className="border border-border rounded-lg overflow-hidden">
                    {/* Image Display */}
                    <div className="relative aspect-video bg-muted overflow-hidden">
                      {image?.url ? (
                        <Image
                          src={image?.url}
                          alt={image?.title || 'Imagen clínica'}
                          className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                          onClick={() => setSelectedImage(image)}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <Icon name="ImageOff" size={48} />
                        </div>
                      )}
                      
                      {isEditing && (
                        <div className="absolute top-2 right-2 flex space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteImage(image?.id)}
                            iconName="Trash2"
                            iconSize={16}
                            className="bg-error/80 text-white hover:bg-error w-8 h-8"
                          />
                        </div>
                      )}
                    </div>

                    {/* Image Details */}
                    <div className="p-4 space-y-3">
                      {isEditing ? (
                        <>
                          <Input
                            label="Título"
                            type="text"
                            value={image?.title}
                            onChange={(e) => updateImage(image?.id, 'title', e?.target?.value)}
                            placeholder="Título de la imagen"
                          />
                          <Select
                            label="Categoría"
                            options={imageCategories}
                            value={image?.category}
                            onChange={(value) => updateImage(image?.id, 'category', value)}
                          />
                          <Input
                            label="Diente/Zona"
                            type="text"
                            value={image?.tooth}
                            onChange={(e) => updateImage(image?.id, 'tooth', e?.target?.value)}
                            placeholder="Ej: 16, 11-21"
                          />
                          <Input
                            label="Fecha"
                            type="date"
                            value={image?.date}
                            onChange={(e) => updateImage(image?.id, 'date', e?.target?.value)}
                          />
                          <Input
                            label="Descripción"
                            type="text"
                            value={image?.description}
                            onChange={(e) => updateImage(image?.id, 'description', e?.target?.value)}
                            placeholder="Descripción de la imagen"
                          />
                          <Input
                            label="URL de la Imagen"
                            type="url"
                            value={image?.url}
                            onChange={(e) => updateImage(image?.id, 'url', e?.target?.value)}
                            placeholder="https://..."
                          />
                        </>
                      ) : (
                        <>
                          <div>
                            <h5 className="font-medium text-foreground">{image?.title || 'Sin título'}</h5>
                            <p className="text-sm text-muted-foreground mt-1">{image?.description}</p>
                          </div>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>{image?.tooth && `Diente: ${image?.tooth}`}</span>
                            <span>{new Date(image.date)?.toLocaleDateString('es-MX')}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {formData?.images?.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Icon name="Camera" size={64} className="mx-auto mb-4 opacity-50" />
            <h4 className="text-lg font-medium mb-2">No hay imágenes clínicas</h4>
            <p className="mb-4">Agrega fotografías y radiografías para documentar el caso</p>
            {isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={addNewImage}
                iconName="Plus"
                iconPosition="left"
                iconSize={16}
              >
                Agregar Primera Imagen
              </Button>
            )}
          </div>
        )}
      </div>
      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-200 bg-black/80 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
          <div className="bg-card rounded-lg max-w-4xl max-h-[90vh] overflow-hidden" onClick={(e) => e?.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div>
                <h4 className="font-medium text-foreground">{selectedImage?.title}</h4>
                <p className="text-sm text-muted-foreground">{selectedImage?.description}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedImage(null)}
                iconName="X"
                iconSize={20}
              />
            </div>
            <div className="p-4">
              <Image
                src={selectedImage?.url}
                alt={selectedImage?.title}
                className="w-full max-h-[70vh] object-contain"
              />
            </div>
            <div className="p-4 border-t border-border">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Categoría: {imageCategories?.find(c => c?.value === selectedImage?.category)?.label}</span>
                <span>Fecha: {new Date(selectedImage.date)?.toLocaleDateString('es-MX')}</span>
                {selectedImage?.tooth && <span>Diente: {selectedImage?.tooth}</span>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClinicalImagesTab;