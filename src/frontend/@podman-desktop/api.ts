export const postMessage = args => {
  console.log(args);
  fetch('/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(args),
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error('Network response was not ok');
  })
  .then(data => {
    const event = new Event('message');
    event['data'] = {
      id: args.id,
      channel: args.channel,
      status: 'OK',
      body: data,
    };
    window.dispatchEvent(event);
  });
};
export const getState = () => {
  console.log('getState');
  const state = sessionStorage.getItem('podman-state');
  if (state) {
    return JSON.parse(state);
  }
  return {};
};
export const setState = args => {
  console.log('setState', args);
  sessionStorage.setItem('podman-state', JSON.stringify(args));
};
export const version = '1.33.7';
