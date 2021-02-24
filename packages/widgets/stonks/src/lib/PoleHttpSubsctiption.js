function poleHttpSubscription(dispatch, data) {
  const handler = () => {
    fetch(data.url)
      .then((res) => res.json())
      .then((responseData) => {
        dispatch(data.action, responseData);
      });
  };
  if(data.immediate) {
    handler();
  }
  const intervalId = window.setInterval(handler, data.interval);

  return () => {
    window.clearInterval(intervalId);
  };
}


export const PoleHttpSubsctiption = data => [poleHttpSubscription, data];