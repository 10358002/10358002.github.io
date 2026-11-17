function initializeCounter() {
  const props = PropertiesService.getScriptProperties();
  if (!props.getProperty('page_count')) {
    props.setProperty('page_count', '0');
  }
}

function getCount() {
  const props = PropertiesService.getScriptProperties();
  return Number(props.getProperty('page_count') || '0');
}

function incrementCount() {
  const props = PropertiesService.getScriptProperties();
  const current = getCount();
  const next = current + 1;
  props.setProperty('page_count', String(next));
  return next;
}

function resetCount() {
  const props = PropertiesService.getScriptProperties();
  props.setProperty('page_count', '0');
  return 0;
}

function getActionFromRequest(e, fallback) {
  if (e && e.parameter && e.parameter.action) {
    return String(e.parameter.action).toLowerCase();
  }

  try {
    const raw = e && e.postData && e.postData.contents ? e.postData.contents : '';
    if (!raw) {
      return fallback;
    }

    const payload = JSON.parse(raw);
    if (payload && payload.action) {
      return String(payload.action).toLowerCase();
    }
  } catch (err) {
    // ignore parse error and fallback below
  }

  return fallback;
}

function handleAction(action) {
  initializeCounter();

  switch ((action || 'get').toLowerCase()) {
    case 'increment':
      return { success: true, count: incrementCount(), action: 'increment' };
    case 'reset':
      return { success: true, count: resetCount(), action: 'reset' };
    case 'get':
    default:
      return { success: true, count: getCount(), action: 'get' };
  }
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  const action = getActionFromRequest(e, 'get');
  const result = handleAction(action);
  return jsonResponse(result);
}

function doPost(e) {
  const action = getActionFromRequest(e, 'increment');
  const result = handleAction(action);
  return jsonResponse(result);
}
