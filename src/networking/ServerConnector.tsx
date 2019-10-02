const get = async (endpoint: string): Promise<Response | null> => {
  try {
    const response = await fetch(`https://localhost:3005/${endpoint}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstParam: 'yourValue',
        secondParam: 'yourOtherValue',
      }),
    });

    return response.json();
  } catch (error) {
    console.warn(error);
  }
};
export { get };
