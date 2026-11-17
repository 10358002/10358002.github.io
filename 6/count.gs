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

function handleAction(action) {
  initializeCounter();
  const type = String(action || 'get').toLowerCase();

  if (type === 'increment') {
    return { success: true, count: incrementCount(), action: 'increment' };
  }

  if (type === 'reset') {
    return { success: true, count: resetCount(), action: 'reset' };
  }

  return { success: true, count: getCount(), action: 'get' };
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || 'get';
  return jsonResponse(handleAction(action));
}

function doPost(e) {
  try {
    const payload = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const action = (payload && payload.action) || 'increment';
    return jsonResponse(handleAction(action));
  } catch (err) {
    return jsonResponse({
      success: false,
      error: 'Invalid JSON payload',
      details: String(err)
    });
  }
}
