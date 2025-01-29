const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

// Authentication middleware
app.use("/customer/auth/*", function auth(req, res, next) {
    // Retrieve the access token from the session
    const accessToken = req.session?.accessToken;

    if (!accessToken) {
        // If no access token is found, respond with Unauthorized
        return res.status(401).json({ message: "Unauthorized: No access token provided" });
    }

    // Verify the access token
    jwt.verify(accessToken, "fingerprint_customer", (err, decoded) => {
        if (err) {
            // Respond with Unauthorized if token verification fails
            return res.status(401).json({ message: "Unauthorized: Invalid access token" });
        }

        // Token is valid; attach the decoded payload to the request object
        req.user = decoded;
        next(); // Proceed to the next middleware or route handler
    });
});
 
const PORT =5023;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
