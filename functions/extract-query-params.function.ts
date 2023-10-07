export default (query: any): {} => {
  if (!query) {
    return {};
  }
  let params: any = {};
  let queries, temp, i, l;
  // Split into key/value pairs
  queries = query.split('?');
  if (queries.length < 2) {
    return {};
  }
  queries = queries[1];
  queries = queries.split('&');
  // Convert the array of strings into an object
  for (i = 0; i < queries.length; i++) {
    temp = queries[i].split('=');
    const _key = `${temp[0]}`.toLowerCase();
    params[_key] = decodeURIComponent(temp[1]);
  }
  return params;
};