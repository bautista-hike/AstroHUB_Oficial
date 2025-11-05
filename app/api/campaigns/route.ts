import { NextResponse } from 'next/server';
import { getGoogleSheetsData } from '@/lib/googleSheets';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Obtener parámetros de filtro
    const filters = {
      pais: searchParams.get('pais') || 'todos',
      plataforma: searchParams.get('plataforma') || 'todas',
      periodoDesde: searchParams.get('periodoDesde') || '',
      periodoHasta: searchParams.get('periodoHasta') || '',
    };

    let data = await getGoogleSheetsData();
    
    if (!data) {
      return NextResponse.json(
        { error: 'No se encontraron datos en la hoja' },
        { status: 404 }
      );
    }

    // NO aplicamos el filtro obligatorio de CONS/APP
    // Solo filtros opcionales básicos
    data = applyBasicFilters(data, filters);

    return NextResponse.json({
      rawData: data,
      success: true,
    });
  } catch (error: any) {
    console.error('Error en API de Campañas:', error);
    return NextResponse.json(
      { error: error.message || 'Error al obtener datos' },
      { status: 500 }
    );
  }
}

function applyBasicFilters(data: any[], filters: any) {
  let filteredData = [...data];

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
    fechaHasta.setDate(fechaHasta.getDate() + 1);
    filteredData = filteredData.filter(row => {
      const rowDate = new Date(row.date);
      return rowDate < fechaHasta;
    });
  }

  return filteredData;
}

