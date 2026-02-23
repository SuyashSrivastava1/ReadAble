import sanitizeHtml from "sanitize-html";

const sanitizeValue = (value) => {
  if (typeof value === "string") {
    return sanitizeHtml(value, {
      allowedTags: [],
      allowedAttributes: {},
    });
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeValue(item));
  }

  if (value && typeof value === "object") {
    return Object.keys(value).reduce((acc, key) => {
      acc[key] = sanitizeValue(value[key]);
      return acc;
    }, {});
  }

  return value;
};

const sanitizeRequest = (req, _res, next) => {
  if (req.body && typeof req.body === "object") {
    req.body = sanitizeValue(req.body);
  }
  if (req.query && typeof req.query === "object") {
    req.query = sanitizeValue(req.query);
  }
  next();
};

export default sanitizeRequest;
