function parseJwt(token) {
    try {
      const base64Url = token.split('.')[1]; // Get the payload part of the JWT
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
  
      const decodedToken = JSON.parse(jsonPayload);
  
      // Log the expiration time in Unix time and human-readable format
      if (decodedToken.exp) {
        const expirationDate = new Date(decodedToken.exp * 1000); // Convert Unix timestamp to JavaScript Date
        console.log('Token expires at:', expirationDate.toLocaleString()); // Log human-readable expiration date
      }
  
      return decodedToken;
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  }

  function IsTokenExpired(token) {
    const decodedToken = parseJwt(token);
    if (!decodedToken || !decodedToken.exp) {
      return true; // Token is invalid or missing exp claim
    }
  
    const currentTime = Math.floor(Date.now() / 1000); // Current time in Unix timestamp
    return decodedToken.exp < currentTime; // True if token is expired
  }

  export default IsTokenExpired;