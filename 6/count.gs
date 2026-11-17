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

  switch (action) {
    case 'increment':
      return { success: true, count: incrementCount(), action: 'increment' };
    case 'reset':
      return { success: true, count: resetCount(), action: 'reset' };
    case 'get':
    default:
      return { success: true, count: getCount(), action: 'get' };
  }
}

function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || 'get';
  const result = handleAction(action);

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  let payload = {};

  try {
    payload = JSON.parse(e && e.postData && e.postData.contents ? e.postData.contents : '{}');
  } catch (err) {
    payload = {};
  }

  const action = payload.action || 'increment';
  const result = handleAction(action);

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}
