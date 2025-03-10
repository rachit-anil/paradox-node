import crypto from 'crypto';


function generateCSRFToken() {
    return crypto.randomBytes(64).toString('hex');
}

export function csrfMiddleware(req, res, next) {
    // Log the CSRF token sent in the request
    console.log('CSRF Token in header:', req.headers['x-xsrf-token']);
    // Log the CSRF token stored in the cookie
    console.log('CSRF Token in cookie:', req.cookies);

    if (req.method === 'GET' && !req.cookies._csrf) {
        const token = generateCSRFToken();
        res.cookie('_csrf', token, { httpOnly: false, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
        next();
    } else if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH' || req.method === 'DELETE') {
        const clientToken = req.headers['x-xsrf-token'];
        const serverToken = req.cookies._csrf;

        if (!clientToken || !serverToken || clientToken !== serverToken) {
            return res.status(403).send('CSRF token validation failed');
        }
        next();
    } else {
        next();
    }
}