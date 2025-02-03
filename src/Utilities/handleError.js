const handleError = (err) => {
    
          if (!err.response) {
            console.log("No response received, check connection");
          }
          console.log(
            "Message: ", err.message, "\n",
            "Code: ", err.code, "\n",
            "Name: ", err.name, "\n"
    );
}

export default handleError