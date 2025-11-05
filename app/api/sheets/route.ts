import { NextResponse } from 'next/server';
import { getGoogleSheetsData, calculateMetrics } from '@/lib/googleSheets';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Obtener parámetros de filtro
    const filters = {
      pais: searchParams.get('pais') || 'todos',
      plataforma: searchParams.get('plataforma') || 'todas',
      periodoDesde: searchParams.get('periodoDesde') || '',
      periodoHasta: searchParams.get('periodoHasta') || '',
      productos: searchParams.get('productos')?.split(',').filter(Boolean) || [],
      filtroIn: searchParams.get('filtroIn') || '',
      filtroOut: searchParams.get('filtroOut') || '',
    };

    let data = await getGoogleSheetsData();
    
    if (!data) {
      return NextResponse.json(
        { error: 'No se encontraron datos en la hoja' },
        { status: 404 }
      );
    }

    // Aplicar filtros
    data = applyFilters(data, filters);

    const metrics = calculateMetrics(data);

    return NextResponse.json({
      metrics,
      rawData: data,
      filters,
      success: true,
    });
  } catch (error: any) {
    console.error('Error en API de Google Sheets:', error);
    return NextResponse.json(
      { error: error.message || 'Error al obtener datos' },
      { status: 500 }
    );
  }
}

function applyFilters(data: any[], filters: any) {
  let filteredData = [...data];

  // Filtro obligatorio: Solo campañas que contengan CONS o APP
  filteredData = filteredData.filter(row => {
    const campaignName = row.campaign_name.toUpperCase();
    return campaignName.includes('CONS') || campaignName.includes('APP');
  });

  // Filtrar por país
  if (filters.pais && filters.pais !== 'todos') {
    filteredData = filteredData.filter(row => 
      row.country.toLowerCase() === filters.pais.toLowerCase()
    );
  }

  // Filtrar por plataforma
  if (filters.plataforma && filters.plataforma !== 'todas') {
    filteredData = filteredData.filter(row => 
      row.platform.toLowerCase().includes(filters.plataforma.toLowerCase())
    );
  }

  // Filtrar por fecha desde
  if (filters.periodoDesde) {
    const fechaDesde = new Date(filters.periodoDesde);
    filteredData = filteredData.filter(row => {
      const rowDate = new Date(row.date);
      return rowDate >= fechaDesde;
    });
  }

  // Filtrar por fecha hasta (incluir todo el día seleccionado)
  if (filters.periodoHasta) {
    const fechaHasta = new Date(filters.periodoHasta);
    // Agregar 1 día para incluir el día completo seleccionado
    fechaHasta.setDate(fechaHasta.getDate() + 1);
    filteredData = filteredData.filter(row => {
      const rowDate = new Date(row.date);
      return rowDate < fechaHasta;
    });
  }

  // Filtrar por productos (si aplica)
  if (filters.productos && filters.productos.length > 0) {
    // Este filtro se puede implementar según la lógica de negocio
    // Por ahora lo dejamos preparado para futuras mejoras
  }

  // Filtrar IN (incluir campañas que contengan estos términos)
  if (filters.filtroIn) {
    const terminos = filters.filtroIn.toLowerCase().split(',').map((t: string) => t.trim());
    filteredData = filteredData.filter(row => {
      const campaignName = row.campaign_name.toLowerCase();
      return terminos.some((term: string) => campaignName.includes(term));
    });
  }

  // Filtrar OUT (excluir campañas que contengan estos términos)
  if (filters.filtroOut) {
    const terminos = filters.filtroOut.toLowerCase().split(',').map((t: string) => t.trim());
    filteredData = filteredData.filter(row => {
      const campaignName = row.campaign_name.toLowerCase();
      return !terminos.some((term: string) => campaignName.includes(term));
    });
  }

  return filteredData;
}

