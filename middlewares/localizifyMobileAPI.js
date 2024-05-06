const localizify = require("localizify");
const localize = new localizify.Instance();

localize.add("en", require("./../utils/locales/en.json"));
localize.add("es", require("./../utils/locales/es.json"));
localize.add("ru", require("./../utils/locales/ru.json"));

module.exports = (request, response, next) => {
  const lang = localize.detectLocale(request.headers["accept-language"]) || "en";
  localize.setLocale(lang);
  request.localize = localize;
  next();
};

exports.localize = localize;