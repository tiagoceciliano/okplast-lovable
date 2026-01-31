import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ImageToMigrate {
  key: string;
  url: string;
}

interface MigrationResult {
  key: string;
  success: boolean;
  newUrl?: string;
  error?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { images } = (await req.json()) as { images: ImageToMigrate[] };

    if (!images || !Array.isArray(images)) {
      return new Response(
        JSON.stringify({ error: "Missing or invalid 'images' array" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const results: MigrationResult[] = [];

    for (const image of images) {
      try {
        console.log(`Downloading: ${image.key} from ${image.url}`);

        // Download the image
        const response = await fetch(image.url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; ImageMigration/1.0)",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to download: ${response.status} ${response.statusText}`);
        }

        const contentType = response.headers.get("content-type") || "image/jpeg";
        const arrayBuffer = await response.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);

        console.log(`Downloaded ${image.key}: ${uint8Array.length} bytes, type: ${contentType}`);

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from("site-images")
          .upload(image.key, uint8Array, {
            contentType,
            upsert: true,
          });

        if (error) {
          throw new Error(`Upload failed: ${error.message}`);
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from("site-images")
          .getPublicUrl(image.key);

        results.push({
          key: image.key,
          success: true,
          newUrl: publicUrlData.publicUrl,
        });

        console.log(`✓ Uploaded ${image.key} -> ${publicUrlData.publicUrl}`);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error(`✗ Failed ${image.key}: ${errorMessage}`);
        results.push({
          key: image.key,
          success: false,
          error: errorMessage,
        });
      }
    }

    const successful = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    return new Response(
      JSON.stringify({
        summary: {
          total: images.length,
          successful,
          failed,
        },
        results,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("Migration error:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
