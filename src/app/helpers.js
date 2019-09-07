const getParam = paramName => {
  const url = new URL(window.location.href);
  const query_string = url.search;
  const searchParams = new URLSearchParams(query_string);

  return searchParams.get(paramName);
};

export { getParam };
