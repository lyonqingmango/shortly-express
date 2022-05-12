const parseCookies = (req, res, next) => {
  if (!req.headers.cookie) {
    req.cookies = {};
  } else {
    var cookieArray = req.headers.cookie.split('; ');
    cookieArray.forEach((cookieString) => {
      var newarr = cookieString.split('=');
      console.log('our new arr', newarr);
      req.cookies[newarr[0]] = newarr[1];
    });
  }
  next();
};

module.exports = parseCookies;