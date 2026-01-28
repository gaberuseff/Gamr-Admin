import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

// CORS headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // ===== 1️⃣ قراءة البيانات من الطلب =====
        const { userId, action } = await req.json()

        if (!userId || !action) {
            return new Response(
                JSON.stringify({ error: "userId and action are required" }), 
                { 
                    status: 400,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            )
        }

        // ===== 2️⃣ إنشاء Supabase Admin Client =====
        const supabaseAdmin = createClient(
            SUPABASE_URL,
            SUPABASE_SERVICE_ROLE_KEY
        )

        // ===== 3️⃣ التحقق من هوية اللي بعت الطلب =====
        const authHeader = req.headers.get("Authorization")
        if (!authHeader) {
            return new Response(
                JSON.stringify({ error: "Unauthorized" }), 
                { 
                    status: 401,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            )
        }

        const token = authHeader.replace("Bearer ", "")
        const { data: { user } } = await supabaseAdmin.auth.getUser(token)

        // ===== 4️⃣ التأكد إنه Admin =====
        if (!user || user.user_metadata?.role !== "admin") {
            return new Response(
                JSON.stringify({ error: "Forbidden - Admin only" }), 
                { 
                    status: 403,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            )
        }

        // ===== 5️⃣ تنفيذ الأوامر =====

        // 🔒 Block user
        if (action === "block") {
            // حظر في Supabase Auth - استخدام ban_duration لمنع تسجيل الدخول
            await supabaseAdmin.auth.admin.updateUserById(userId, {
                ban_duration: '876000h' // حظر لمدة ~100 سنة (عملياً دائم)
            })

            // تحديث جدول profiles
            await supabaseAdmin
                .from("profiles")
                .update({ is_blocked: true })
                .eq("id", userId)

            return new Response(
                JSON.stringify({ message: "User blocked successfully" }),
                { 
                    status: 200,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            )
        }

        // 🔓 Unblock user
        if (action === "unblock") {
            // إلغاء الحظر من Supabase Auth
            await supabaseAdmin.auth.admin.updateUserById(userId, {
                ban_duration: 'none' // إلغاء الحظر تماماً
            })

            // تحديث جدول profiles
            await supabaseAdmin
                .from("profiles")
                .update({ is_blocked: false })
                .eq("id", userId)

            return new Response(
                JSON.stringify({ message: "User unblocked successfully" }),
                { 
                    status: 200,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            )
        }

        // ❌ Delete user completely
        if (action === "delete") {
            try {
                // حذف من profiles أولاً
                const { error: profileError } = await supabaseAdmin
                    .from("profiles")
                    .delete()
                    .eq("id", userId)

                if (profileError) {
                    console.error("Profile deletion error:", profileError)
                }

                // حذف من Supabase Auth
                const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId)

                if (authError) {
                    throw new Error(`Failed to delete user from Auth: ${authError.message}`)
                }

                return new Response(
                    JSON.stringify({ message: "User deleted completely" }),
                    { 
                        status: 200,
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                    }
                )
            } catch (error) {
                console.error("Delete user error:", error)
                return new Response(
                    JSON.stringify({ error: error.message || "Failed to delete user" }),
                    { 
                        status: 500,
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                    }
                )
            }
        }

        return new Response(
            JSON.stringify({ error: "Invalid action" }), 
            { 
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        )

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { 
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        )
    }
})
