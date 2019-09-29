export default async function(request: string) {
  try {
    let response = await fetch('localhost:8080/song', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: request,
    });
  } catch (error) {
    console.error(error);
  }
}
