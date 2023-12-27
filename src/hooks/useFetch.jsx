import { useEffect, useState } from "react";
import { fetchDataFromApi } from "../utils/Api";
const useFetch = (url) => {
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading("loading...");
        setResponse(null);
        setError(null);

        fetchDataFromApi(url)
            .then((res) => {
                setLoading(false);
                setResponse(res);
            })
            .catch((err) => {
                setLoading(false);
                setError("Something went wrong!");
            });
    }, [url]);

    return { response, loading, error };
};

export default useFetch;