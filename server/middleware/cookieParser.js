const parseCookies = (req, res, next) => {
  if (!req.headers.cookie) {
    req.cookies = {};
  } else {
    req.cookies = {};
    var cookieArray = req.headers.cookie.split('; ');
    cookieArray.forEach((cookieString) => {
      var newarr = cookieString.split('=');
      req.cookies[newarr[0]] = newarr[1];
    });
  }
  next();
};

module.exports = parseCookies;