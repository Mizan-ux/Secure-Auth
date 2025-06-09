import jwt from "jsonwebtoken"

export const isLoggedIn = async (req, res, next) => {
    try {
        // console.log(req.cookies);
        let token = req.cookies?.token
        // console.log('Token Found: ', token ? "YES" : "NO");
        if (!token) {
            console.log("No Token");
            return res.status(401).json({
                success: false,
                message: "Authentication failed",
            })
        }

        let decoded = jwt.verify(token, process.env.SECREATEKEY);
        // console.log(decoded);
        req.user = decoded;
        next()
    } catch (error) {
        console.log("Auth middleware failure");
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}