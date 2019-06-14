require('dotenv').config();
const jwt = require('jsonwebtoken');

//WE WILL NEED TO ADD ONE OF THESE / CREATE ONE AND ADD IT TO THE DEPLOYED VERSION OF THE SITE. 
const secureKey = process.env.SECURE_KEY;


const validateToken = (req, res, next) => {
    const token = req.get('Authorization');
    if (!token) {
      return res.status(401).json({
        error: 'No token provided. It must be set on the Authorization Header.'
      });
    }
    return jwt.verify(token, secureKey, (err, decoded) => {
      if (err)
        return res
          .status(401)
          .json({ error: `Your login has expired. Please sign in again. ${err}` });
      req.decoded = decoded;
      next();
    });
  };

  const generateToken = async ( username, id, expiration) => {
    let tomorrow = await new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const totalHours = tomorrow.getTime() / 1000 / 3600;
    let payload = {
      username,
      id,
      total_hours: totalHours
    };
  
    // if (email) payload.email = email;
  
    const secret =
      secureKey || 'Should configure local .env file for secretString'; // hard coding this in the code is bad practice
  
    const options = {
      expiresIn: expiration || tokenOptionExpiration // 60 seconds... otherValues(20, '2 days', '10h', '7d'), a number represents seconds (not milliseconds)
    };
  
    const token = await jwt.sign(payload, secret, options);
    return token;
  };


module.exports = {
    generateToken, 
    validateToken, 
}