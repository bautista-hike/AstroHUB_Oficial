import { NextResponse } from 'next/server';
import { getCreativesData, getGoogleSheetsData } from '@/lib/googleSheets';

// Función para detectar plataforma desde campaign_name
function detectPlatform(campaignName: string): string {
  const name = campaignName.toUpperCase()
  if (name.includes('GG_') || name.includes('GOOGLE')) return 'Google'
  if (name.includes('FB_') || name.includes('FACEBOOK') || name.includes('META')) return 'Meta'
  if (name.includes('TK_') || name.includes('TIKTOK')) return 'TikTok'
  if (name.includes('LI_') || name.includes('LINKEDIN')) return 'LinkedIn'
  if (name.includes('AP_') || name.includes('APPLE') || name.includes('APL')) return 'Apple'
  if (name.includes('X_') || name.includes('TWITTER')) return 'Twitter'
  return 'Unknown'
}

// Función para detectar producto desde campaign_name
function detectProduct(campaignName: string): string {
  if (!campaignName) return 'Unknown'
  const name = campaignName.toUpperCase().trim()
  // Detectar PIX - debe estar primero para tener prioridad
  if (name.includes('PIX')) return 'PIX Payments'
  if (name.includes('CURRENCYEX') || name.includes('CURRENCY_EXCHANGE')) return 'Currency Exchange'
  if (name.includes('GLOBALCARD') || name.includes('GLOBAL_CARD') || name.includes('GLOBAL-CARD')) return 'Global Card'
  if (name.includes('LOCALCARD') || name.includes('LOCAL_CARD')) return 'Local Card'
  if (name.includes('USDT')) return 'USDT Payments'
  return 'Unknown'
}

// Función para detectar etapa desde campaign_name
function detectStage(campaignName: string): string {
  const name = campaignName.toUpperCase()
  // Verificar si termina en BRAND, CATEGORY o COMPETITION
  if (name.endsWith('BRAND') || name.endsWith('CATEGORY') || name.endsWith('COMPETITION')) {
    return 'branding'
  }
  if (name.includes('AWA') || name.includes('AWARENESS') || name.includes('REACH') || name.includes('VIEWS')) return 'awareness'
  if (name.includes('ENG') || name.includes('ENGAGEMENT')) return 'engagement'
  if (name.includes('SRC') || name.includes('BRAND') || name.includes('CATEGORY')) return 'search'
  return 'app' // Por defecto, si no coincide, es APP
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Obtener parámetros de filtro
    const filters = {
      campaign_name: searchParams.get('campaign_name') || '',
      platform: searchParams.get('platform') || '',
      product: searchParams.get('product') || '',
      country: searchParams.get('country') || '',
      stage: searchParams.get('stage') || '',
      status: searchParams.get('status') || 'all',
    };

    // Obtener creativos
    const creativesData = await getCreativesData();
    
    // Obtener datos de campañas para calcular métricas
    const campaignsData = await getGoogleSheetsData();
    
    if (!campaignsData) {
      return NextResponse.json({
        error: 'No se encontraron datos de campañas',
        success: false,
      }, { status: 404 });
    }

    // Agrupar métricas por campaña
    const campaignMetrics = new Map<string, any>();
    
    campaignsData.forEach((row: any) => {
      const campaignName = row.campaign_name;
      if (!campaignName) return;
      
      if (!campaignMetrics.has(campaignName)) {
        campaignMetrics.set(campaignName, {
          campaign_name: campaignName,
          campaign_id: row.campaign_id || '',
          platform: row.platform || detectPlatform(campaignName),
          product: detectProduct(campaignName),
          stage: detectStage(campaignName),
          country: row.country || '',
          cost: 0,
          impressions: 0,
          clicks: 0,
          installs: 0,
          accountsCreated: 0,
          ftt: 0,
        });
      }
      
      const metrics = campaignMetrics.get(campaignName)!;
      metrics.cost += row.cost || 0;
      metrics.impressions += row.impressions || 0;
      metrics.clicks += row.clicks || 0;
      metrics.installs += row.installs || 0;
      metrics.accountsCreated += row.registration_complete || 0;
      metrics.ftt += row.ftt || 0;
    });

    // Combinar creativos con métricas de campañas
    const creativesWithMetrics = creativesData.map((creative: any) => {
      const campaignName = creative.campaign_name;
      const metrics = campaignMetrics.get(campaignName) || {
        campaign_name: campaignName,
        cost: 0,
        impressions: 0,
        clicks: 0,
        installs: 0,
        accountsCreated: 0,
        ftt: 0,
      };

      // Si el creativo no tiene platform/product/stage/country, detectarlos desde campaign_name
      const platform = creative.platform || detectPlatform(campaignName);
      const product = creative.product || detectProduct(campaignName);
      const stage = creative.stage || detectStage(campaignName);
      const country = creative.country || metrics.country || '';

      return {
        ...creative,
        platform,
        product,
        stage,
        country,
        metrics: {
          cost: metrics.cost,
          impressions: metrics.impressions,
          clicks: metrics.clicks,
          installs: metrics.installs,
          accountsCreated: metrics.accountsCreated,
          ftt: metrics.ftt,
          cpi: metrics.installs > 0 ? metrics.cost / metrics.installs : 0,
          cac: metrics.accountsCreated > 0 ? metrics.cost / metrics.accountsCreated : 0,
          ctr: metrics.impressions > 0 ? (metrics.clicks / metrics.impressions) * 100 : 0,
          conversion: metrics.installs > 0 ? (metrics.accountsCreated / metrics.installs) * 100 : 0,
        },
      };
    });

    // Aplicar filtros
    let filteredCreatives = creativesWithMetrics;
    
    if (filters.campaign_name) {
      filteredCreatives = filteredCreatives.filter((c: any) =>
        c.campaign_name.toLowerCase().includes(filters.campaign_name.toLowerCase())
      );
    }
    
    if (filters.platform) {
      filteredCreatives = filteredCreatives.filter((c: any) =>
        c.platform.toLowerCase() === filters.platform.toLowerCase()
      );
    }
    
    if (filters.product) {
      filteredCreatives = filteredCreatives.filter((c: any) =>
        c.product.toLowerCase().includes(filters.product.toLowerCase())
      );
    }
    
    if (filters.country) {
      filteredCreatives = filteredCreatives.filter((c: any) =>
        c.country.toLowerCase() === filters.country.toLowerCase()
      );
    }
    
    if (filters.stage) {
      filteredCreatives = filteredCreatives.filter((c: any) =>
        c.stage.toLowerCase() === filters.stage.toLowerCase()
      );
    }
    
    if (filters.status !== 'all') {
      filteredCreatives = filteredCreatives.filter((c: any) =>
        c.status.toLowerCase() === filters.status.toLowerCase()
      );
    }

    // Agrupar creativos por campaña
    const groupedByCampaign = new Map<string, any>();
    
    filteredCreatives.forEach((creative: any) => {
      const campaignName = creative.campaign_name;
      if (!groupedByCampaign.has(campaignName)) {
        groupedByCampaign.set(campaignName, {
          campaign_name: campaignName,
          campaign_id: creative.campaign_id,
          platform: creative.platform,
          product: creative.product,
          stage: creative.stage,
          country: creative.country,
          metrics: creative.metrics,
          creatives: [],
        });
      }
      
      groupedByCampaign.get(campaignName)!.creatives.push(creative);
    });

    return NextResponse.json({
      success: true,
      creatives: Array.from(groupedByCampaign.values()),
      totalCreatives: filteredCreatives.length,
      totalCampaigns: groupedByCampaign.size,
      filters,
    });
  } catch (error: any) {
    console.error('Error en API de Creativos:', error);
    return NextResponse.json(
      { error: error.message || 'Error al obtener creativos', success: false },
      { status: 500 }
    );
  }
}

