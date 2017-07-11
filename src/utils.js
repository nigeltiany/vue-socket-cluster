function normalizeConnectionClient(connection) {
    return connection.name+'Client'
}

function normalizeConnectionEvents(connection) {
    return connection.name+'Events'
}

function normalizeConnectionHooks(connection) {
    return connection.name+'Hooks'
}

function snakeToCamel(s){
  return s.replace(/(\-\w)/g, function(m){return m[1].toUpperCase();});
}

export {
    normalizeConnectionClient,
    normalizeConnectionEvents,
    normalizeConnectionHooks,
    snakeToCamel
}
