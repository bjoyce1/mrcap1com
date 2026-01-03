import { supabase } from "@/integrations/supabase/client";

export interface PrintfulProduct {
  sync_product: {
    id: number;
    external_id: string;
    name: string;
    variants: number;
    synced: number;
    thumbnail_url: string;
    is_ignored: boolean;
  };
  sync_variants: Array<{
    id: number;
    external_id: string;
    sync_product_id: number;
    name: string;
    synced: boolean;
    variant_id: number;
    retail_price: string;
    currency: string;
    is_ignored: boolean;
    sku: string;
    product: {
      variant_id: number;
      product_id: number;
      image: string;
      name: string;
    };
    files: Array<{
      id: number;
      type: string;
      hash: string;
      url: string | null;
      filename: string;
      mime_type: string;
      size: number;
      width: number;
      height: number;
      dpi: number | null;
      status: string;
      created: number;
      thumbnail_url: string;
      preview_url: string;
      visible: boolean;
    }>;
  }>;
}

export async function fetchPrintfulProducts(): Promise<PrintfulProduct[]> {
  try {
    const { data, error } = await supabase.functions.invoke('printful-products');

    if (error) {
      console.error('Error fetching Printful products:', error);
      return [];
    }

    return data?.products || [];
  } catch (error) {
    console.error('Error fetching Printful products:', error);
    return [];
  }
}

// Helper to get the best preview image for a product
export function getProductImage(product: PrintfulProduct): string {
  // First try thumbnail from sync_product
  if (product.sync_product.thumbnail_url) {
    return product.sync_product.thumbnail_url;
  }
  
  // Then try variant preview images
  const variant = product.sync_variants?.[0];
  if (variant?.files) {
    const previewFile = variant.files.find(f => f.type === 'preview');
    if (previewFile?.preview_url) {
      return previewFile.preview_url;
    }
  }
  
  // Fallback to product image
  if (variant?.product?.image) {
    return variant.product.image;
  }
  
  return '/placeholder.svg';
}

// Helper to get the lowest price from variants
export function getLowestPrice(product: PrintfulProduct): { amount: string; currency: string } {
  const prices = product.sync_variants
    .map(v => parseFloat(v.retail_price))
    .filter(p => !isNaN(p));
  
  const lowestPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const currency = product.sync_variants[0]?.currency || 'USD';
  
  return {
    amount: lowestPrice.toFixed(2),
    currency
  };
}
