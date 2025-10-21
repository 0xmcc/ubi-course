module.exports = async (req, res) => {
    console.log('========== TEST FUNCTION START ==========');
    console.log('Method:', req.method);
    console.log('Time:', new Date().toISOString());
    console.log('Env vars present:', {
        hasSupabaseUrl: !!process.env.SUPABASE_URL,
        hasSupabaseKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        hasResendKey: !!process.env.RESEND_API_KEY
    });
    console.log('========== TEST FUNCTION END ==========');
    
    return res.status(200).json({ 
        message: 'Test successful',
        timestamp: new Date().toISOString()
    });
};