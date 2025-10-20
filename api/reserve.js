const { Resend } = require('resend');
const { createClient } = require('@supabase/supabase-js');

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email } = req.body || {};

    if (!email || typeof email !== 'string' || !email.includes('@')) {
        return res.status(400).json({ error: 'Valid email required' });
    }

    try {
        // 1) Get next available cohort
        const { data: cohort, error: cohortError } = await supabase
            .from('cohorts')
            .select('id, date, capacity, enrolled')
            .eq('status', 'open')
            .lt('enrolled', supabase.raw('capacity')) // enrolled < capacity
            .gte('date', new Date().toISOString().split('T')[0]) // future dates only
            .order('date', { ascending: true })
            .limit(1)
            .single();

        if (cohortError || !cohort) {
            console.error('No available cohorts:', cohortError);
            return res.status(400).json({ error: 'No cohorts available. Check back soon!' });
        }

        // 2) Save to Supabase leads table
        const { data: leadData, error: dbError } = await supabase
            .from('leads')
            .insert([{
                email,
                source: 'workshop',
                cohort_date: cohort.date,
                cohort_id: cohort.id,
                status: 'pending',
                created_at: new Date().toISOString()
            }])
            .select();

        if (dbError) {
            console.error('Supabase error:', dbError);
            // Continue with email notifications even if DB fails
        }

        // 3) Increment enrolled count (optimistic)
        await supabase
            .from('cohorts')
            .update({ enrolled: cohort.enrolled + 1 })
            .eq('id', cohort.id);

        // Format cohort date for display
        const cohortDateFormatted = new Date(cohort.date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        });

        // 4) Notify your team
        await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'notifications@yourdomain.com',
            to: process.env.RESEND_NOTIFICATION_EMAIL || 'team@yourdomain.com',
            subject: 'New Vibecoding reservation started',
            html: `<p>New reservation request from: <strong>${email}</strong></p>
<p>Cohort: ${cohortDateFormatted}</p>
<p>They may have completed checkout already. Keep them in the loop.</p>`
        });

        // 5) Send welcome/confirmation to the user
        await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'notifications@yourdomain.com',
            to: email,
            subject: 'You\'re on the list - Cursor & Beyond',
            html: `<div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="margin: 0 0 12px;">Welcome - we saved your spot</h2>
  <p style="margin: 0 0 12px;">Thanks for reserving for our ${cohortDateFormatted} cohort (SF). If you didn\'t finish checkout, use this link:</p>
  <p style="margin: 0 16px 16px;"><a href="https://buy.stripe.com/fZuaEW35dctq4PsghgafS01" style="color:#6B46C1;">Complete checkout</a></p>
  <hr style="border:none;border-top:1px solid #eee; margin: 16px 0;">
  <p style="margin:0;color:#555;">$500 · 3 sessions · small group · real shipping.</p>
</div>`
        });

        return res.status(200).json({ ok: true });
    } catch (error) {
        console.error('Resend error:', error);
        return res.status(500).json({ error: 'Failed to notify via email.' });
    }
};
