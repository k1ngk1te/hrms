const downloadFile = async (url: string, file_name: string) => {
    try {
      const response = await fetch(url, {method: "GET"});
      const data = await response.blob();

      if (response.status === 200 && data) {
        const url = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", file_name);
        document.body.appendChild(link);
        link.click();
        return {
          status: 200,
          data: "Downloading...",
        };
      }
    } catch (err: any) {
      return {
        status: err ? err?.response?.status : 500,
        data: err ? err?.response?.data || err?.message : "A server error occurred!",
      };
    }
};

export default downloadFile;
