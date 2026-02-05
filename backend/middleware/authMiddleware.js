// // import jwt from "jsonwebtoken";
// // import User from "../model/user.model/user.model.js";

// // export const protect = async (req, res, next) => {
// //   let token;

// //   if (req.headers.authorization &&
// //       req.headers.authorization.startsWith("Bearer")) {
    
// //     try {
// //       token = req.headers.authorization.split(" ")[1];

// //       const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");

// //       req.user = await User.findById(decoded.id).select("-password");

// //       if (!req.user) {
// //         return res.status(401).json({ message: "User not found" });
// //       }

// //       next();
// //     } catch (error) {
// //       return res.status(401).json({ message: "Not authorized", error });
// //     }
// //   } else {
// //     return res.status(401).json({ message: "No token provided" });
// //   }
// // };



// // export const protectRoute = async (req, res, next) => {
// //   try {
// //     const token = req.headers.authorization?.split(" ")[1];
// //     if (!token) return res.status(401).json({ message: "No token, access denied" });

// //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
// //     req.user = await User.findById(decoded.id).select("-password");

// //     next();
// //   } catch (err) {
// //     res.status(401).json({ message: "Invalid token" });
// //   }
// // };

// // export const adminOnly = (req, res, next) => {
// //   if (!req.user || req.user.role !== "admin") {
// //     return res.status(403).json({ message: "Admin only" });
// //   }
// //   next();
// // };
// import jwt from "jsonwebtoken";
// import User from "../model/user.model/user.model.js";

// const JWT_SECRET = process.env.JWT_SECRET || "yourSecretKey";

// /**
//  * protect middleware
//  * - Expects header: Authorization: Bearer <token>
//  * - Attaches full user document (without password) to req.user
//  */
// export const protect = async (req, res, next) => {
//   let token = null;

//   try {
//     const auth = req.headers.authorization || req.headers.Authorization;
//     if (!auth || !auth.startsWith("Bearer ")) {
//       return res.status(401).json({ message: "No token provided" });
//     }

//     token = auth.split(" ")[1];
//     const decoded = jwt.verify(token, JWT_SECRET);

//     const user = await User.findById(decoded.id).select("-password");
//     if (!user) return res.status(401).json({ message: "User not found" });

//     req.user = user;
//     next();
//   } catch (err) {
//     console.error("protect middleware error:", err);
//     return res.status(401).json({ message: "Not authorized", error: err.message });
//   }
// };

// /**
//  * adminOnly middleware
//  */
// export const adminOnly = (req, res, next) => {
//   if (!req.user) return res.status(401).json({ message: "Not authenticated" });
//   if (req.user.role !== "admin") return res.status(403).json({ message: "Admin only" });
//   next();
// };


// export default { protect, adminOnly };
import jwt from "jsonwebtoken";
import User from "../model/user.model/user.model.js";

const JWT_SECRET = process.env.JWT_SECRET || "yourSecretKey";

/**
 * protect middleware
 */
export const protect = async (req, res, next) => {
  try {
    const auth =
      req.headers.authorization || req.headers.Authorization;

    if (!auth || !auth.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = auth.split(" ")[1];

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("protect middleware error:", err);

    // ✅ HANDLE EXPIRED TOKEN CLEANLY
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expired, please login again",
      });
    }

    return res.status(401).json({
      message: "Not authorized, token invalid",
    });
  }
};

/**
 * adminOnly middleware
 */
export const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }

  next();
};

export default { protect, adminOnly };



