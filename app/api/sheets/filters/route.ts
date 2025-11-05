import { NextResponse } from 'next/server';
import { getGoogleSheetsData } from '@/lib/googleSheets';

export async function GET() {
  try {
    const data = await getGoogleSheetsData();
    
    if (!data) {
      return NextResponse.json(
        { error: 'No se encontraron datos en la hoja' },
        { status: 404 }
      );
    }

    // Obtener valores únicos de países
    const paises = [...new Set(data.map(row => row.country).filter(Boolean))].sort();
    
    // Obtener valores únicos de plataformas
    const plataformas = [...new Set(data.map(row => row.platform).filter(Boolean))].sort();

    return NextResponse.json({
      paises,
      plataformas,
      success: true,
    });
  } catch (error: any) {
    console.error('Error en API de filtros:', error);
    return NextResponse.json(
      { error: error.message || 'Error al obtener filtros' },
      { status: 500 }
    );
  }
}

