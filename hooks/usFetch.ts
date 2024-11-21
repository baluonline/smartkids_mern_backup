import axios from "axios"
import { useEffect, useState } from "react"

const useFetch = (url: string) => {
  const [isLoading, setIsLoading] = useState(false)
  const [apiData, setApiData] = useState<any>(null);
  const [serverError, setServerError] = useState(null)
  const [responseStatus, setResponseStatus] = useState(0)

  useEffect(() => {
    setIsLoading(true)
    const fetchData = async () => {
      try {
        const resp = await axios.get(url)
        const data = await resp?.data;
        setApiData(data)
        setIsLoading(false)
        setResponseStatus(resp.status)
      } catch (error: any) {
        setServerError(error)
        setIsLoading(false)
        setResponseStatus(error.status)

        if (error.response) {
          // The server responded with a status other than 2xx
          console.error('Server error:', error.response.status, error.response.data);
        } else if (error.request) {
          // The request was made but no response was received
          console.error('No response from server:', error.request);
        } else {
          // Something happened in setting up the request that triggered the error
          console.error('Axios error:', error.message);
        }
      }
    }
    fetchData();
  }, [url])
  return { isLoading, apiData, serverError, responseStatus }
}

export default useFetch;