const admin = require("firebase-admin");

module.exports = (req, res, next) => {
  const serviceAccount = require("../serviceAccountKey.json");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  const idToken = req?.headers?.authorization?.split(" ")[1];
  console.log(idToken);
  if (idToken) {
    admin
      .auth()
      .verifyIdToken(idToken)
      .then((decodedToken) => {
        const uid = decodedToken.uid;
        req.uid = uid;
        next();
      })
      .catch((err) => {
        console.log("Error: ", err);
        return res.status(401).json({
          success: false,
          message: "Not Authorized!",
        });
      });
  } else
    return res.status(401).json({ success: false, message: "Not Authorized" });
};