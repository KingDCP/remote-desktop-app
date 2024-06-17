window.addEventListener('DOMContentLoaded', () => {
  const ws = new WebSocket('ws://localhost:8080');
  const imageElement = document.createElement('img');
  document.body.appendChild(imageElement);

  ws.onopen = () => {
    console.log('Connected to server successfully!');
  };

  ws.onmessage = (event) => {
    console.log('Received a message from server');
    const imgData = event.data;
    try {
      imageElement.src = `data:image/png;base64,${imgData}`;
      console.log('Image data successfully set');
    } catch (error) {
      console.error('Error setting image data:', error);
    }
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  ws.onclose = () => {
    console.log('Disconnected from server.');
  };

  window.addEventListener('mousemove', (event) => {
    const command = JSON.stringify({
      type: 'mouse',
      x: event.clientX,
      y: event.clientY,
    });
    ws.send(command);
    console.log('Sent mouse move command:', command);
  });

  window.addEventListener('click', (event) => {
    const command = JSON.stringify({
      type: 'click',
      button: event.button === 0 ? 'left' : 'right',
    });
    ws.send(command);
    console.log('Sent click command:', command);
  });

  window.addEventListener('keydown', (event) => {
    const command = JSON.stringify({
      type: 'keyboard',
      key: event.key,
    });
    ws.send(command);
    console.log('Sent key press command:', command);
  });
});

